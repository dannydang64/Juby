"use client"
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [hearts, setHearts] = useState([]);
  const [farts, setFarts] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);
  const [playerX, setPlayerX] = useState(50);
  const playerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [...prev, { id: Date.now(), x: Math.random() * 90, y: 0 }]);
      setFarts((prev) => [...prev, { id: Date.now(), x: Math.random() * 90, y: 0 }]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setHearts((prev) => 
        prev.map((h) => ({ ...h, y: h.y + 5 }))
           .filter((h) => {
             if (h.y >= 100) {
               return false;
             }
             return true;
           })
      );
      setFarts((prev) => prev.map((f) => ({ ...f, y: f.y + 5 })).filter((f) => f.y < 100));
    }, 200);
    return () => clearInterval(gameLoop);
  }, []);

  const shoot = () => {
    setHearts((prev) => prev.filter((h) => {
      if (h.y < 30) {
        setScore((prev) => {
          if (prev + 4 >= 69) {
            setScore(69)
            setWinner(true);
          }
          return prev + 1;
        });
        return false;
      }
      return true;
    }));
  };

  useEffect(() => {
    if (farts.some((f) => f.y >= 90 && Math.abs(f.x - playerX) < 10)) {
      setGameOver(true);
    }
  }, [farts, playerX]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerX((prev) => Math.max(prev - 10, 0));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerX((prev) => Math.min(prev + 10, 90));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes sparkle {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.5); }
            100% { opacity: 0; transform: scale(2); }
        }
        .sparkles::after {
            content: '✨✨✨';
            font-size: 5rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: sparkle 2s infinite;
        }
    `;
    document.head.appendChild(style);
  }, []);

  const showFireworks = () => {
    document.body.innerHTML = `<div style='position:fixed;top:0;left:0;width:100vw;height:100vh;background:black;display:flex;justify-content:center;align-items:center;'>
        <img src='/juby.png' style='max-width:90vw;max-height:90vh;object-fit:contain;' />
        <div class="sparkles"></div>
    </div>`; 
    let fairySound = new Audio('https://www.myinstants.com/media/sounds/magic.mp3');
    fairySound.volume = 1.0;
    fairySound.play();
    fairySound.play();
    setTimeout(() => window.location.reload(), 12000);
  };

  const showScaryScreen = () => {
    document.body.innerHTML = `<div style='position:fixed;top:0;left:0;width:100vw;height:100vh;background:black;display:flex;justify-content:center;align-items:center;'>
        <img src='/scary_girly.png' style='max-width:90vw;max-height:90vh;object-fit:contain;' />
    </div>`;
    let audio = new Audio('https://www.myinstants.com/media/sounds/scream.mp3');
    audio.play();
    setTimeout(() => window.location.reload(), 12000);
  };

  return (
    <div className="relative h-screen w-screen bg-blue-100 overflow-hidden text-center">
      <h1 className="text-3xl font-bold">JUBY Taco Shooter: Valentine's Edition</h1>
      <p className="mt-2">Shoot the hearts to increase score, avoid the farts!</p>
      <p className="mt-2 text-lg">Controls: Use Left/Right Arrow Keys or A/D to move. Click "Shoot 💘" to shoot hearts.</p>
      <p className="text-xl font-bold">Score: {score}/69</p>

      {winner ? (
        <div className="mt-6">
          <h2 className="text-pink-500 text-3xl">WILL U BE MY VALENTINE? ❤️</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded m-2" onClick={showFireworks}>Yes</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded m-2" onClick={showScaryScreen}>No</button>
        </div>
      ) : gameOver ? (
        <h2 className="text-red-500 text-2xl mt-6">Game Over! Score: {score}</h2>
      ) : (
        <>
          <div
            ref={playerRef}
            className="absolute bottom-10 w-16 h-16 bg-green-500"
            style={{ left: `${playerX}%` }}
          ></div>
          {hearts.map((heart) => (
            <div key={heart.id} className="absolute text-red-500 text-3xl" style={{ left: `${heart.x}%`, top: `${heart.y}%` }}>❤️</div>
          ))}
          {farts.map((fart) => (
            <div key={fart.id} className="absolute text-gray-500 text-3xl" style={{ left: `${fart.x}%`, top: `${fart.y}%` }}>🌮</div>
          ))}
          <button onClick={shoot} className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">Shoot 💘</button>
        </>
      )}
    </div>
  );
}
