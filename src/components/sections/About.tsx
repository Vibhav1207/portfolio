import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Award, Globe, FileText, ArrowUpRight, MapPin, Sparkles, User } from "lucide-react";
import { supabase, isPlaceholder } from "@/lib/supabase";
import { mockProjects, mockCertificates } from "@/lib/mockData";

interface TerminalLine {
  id: string;
  type: 'input' | 'output';
  content: string | React.ReactNode;
}

function MatrixRain({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions relative to its container
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth || 300;
        canvas.height = canvas.parentElement.clientHeight || 200;
      }
    };
    resizeCanvas();

    // Listen to resize
    window.addEventListener("resize", resizeCanvas);

    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");

    const fontSize = 10;
    const columns = Math.floor(canvas.width / fontSize) + 1;

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100; // staggered start
    }

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0"; // Green text
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        // Draw the character
        const yCoord = rainDrops[i] * fontSize;
        if (yCoord > 0) {
          ctx.fillText(text, i * fontSize, yCoord);
        }

        if (yCoord > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-30 bg-black flex flex-col justify-end items-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-40 px-2 py-1 bg-red-600/80 hover:bg-red-600 text-white rounded text-[9px] font-mono border border-red-500/50 shadow-md transition-all uppercase cursor-pointer"
      >
        Exit [ESC]
      </button>
    </div>
  );
}

export default function About() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [inputVal, setInputVal] = useState("");
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Shell history
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Themes
  const [terminalTheme, setTerminalTheme] = useState<'classic' | 'cyberpunk' | 'hacker'>('classic');

  // Matrix code rain canvas overlay
  const [matrixActive, setMatrixActive] = useState(false);

  // Number guessing game
  const [gameActive, setGameActive] = useState(false);
  const [targetNumber, setTargetNumber] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const getThemeStyles = () => {
    switch (terminalTheme) {
      case 'cyberpunk':
        return {
          containerClass: "bg-slate-950/90 text-cyan-400 border border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.4)]",
          textClass: "text-cyan-400",
          promptClass: "text-yellow-400",
          inputClass: "text-cyan-300",
          headerClass: "border-pink-500/20 text-pink-400",
          buttonClass: "border-pink-500/30 bg-pink-950/20 text-pink-400 hover:bg-pink-500/20 hover:text-pink-200"
        };
      case 'hacker':
        return {
          containerClass: "bg-black text-emerald-400 border border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.4)]",
          textClass: "text-emerald-400",
          promptClass: "text-emerald-500",
          inputClass: "text-emerald-300",
          headerClass: "border-emerald-500/20 text-emerald-500",
          buttonClass: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-200"
        };
      case 'classic':
      default:
        return {
          containerClass: "card-glow-wrapper border-white/10 bg-black/40 text-white/70",
          textClass: "text-white/80",
          promptClass: "text-emerald-400",
          inputClass: "text-white/90",
          headerClass: "border-white/10 text-white/30",
          buttonClass: "border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
        };
    }
  };
  const styles = getThemeStyles();

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const newLines: TerminalLine[] = [];

    // Add input command to history
    newLines.push({
      id: Date.now() + '-input-' + Math.random().toString(36).substr(2, 5),
      type: 'input',
      content: cmd.trim()
    });

    // Add to history list for ArrowUp/Down cycling
    setCmdHistory(prev => {
      // Avoid duplicate consecutive commands
      if (prev.length > 0 && prev[prev.length - 1] === cmd.trim()) {
        return prev;
      }
      return [...prev, cmd.trim()];
    });
    setHistoryIndex(-1);

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    let outputNode: React.ReactNode = null;

    if (trimmed === 'help') {
      outputNode = (
        <div className="space-y-1 text-inherit opacity-90">
          <div className="opacity-50">Available commands:</div>
          <div className="grid grid-cols-[80px_1fr] gap-x-2 pl-2">
            <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">neofetch</span>
            <span>Display system info overview</span>
            <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">skills</span>
            <span>View skills with ASCII charts</span>
            <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">logs</span>
            <span>Read the developer change logs</span>
            <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">git log</span>
            <span>Show simulated git commit history</span>
            <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">matrix</span>
            <span>Launch Canvas matrix code rain</span>
            <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">guess</span>
            <span>Play number guessing mini-game</span>
            <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">theme</span>
            <span>Cycle/select console themes</span>
            <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">coffee</span>
            <span>Simulate brewing a cup of coffee</span>
            <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">sudo</span>
            <span>Execute admin commands</span>
            <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">contact</span>
            <span>Show social links & networks</span>
            <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">clear</span>
            <span>Clear console screen</span>
          </div>
        </div>
      );
    } else if (trimmed === 'neofetch') {
      outputNode = (
        <div className="flex flex-col sm:flex-row gap-4 items-start font-mono text-[9px] md:text-[10px]">
          <pre className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-bold leading-tight select-none shrink-0">
            {`
__      ___   ___   _  _    _    __   __
\\ \\ / / |_ _| | _ ) | || |  / \\  \\ \\ / /
 \\ V /   | |  | _ \\ | __ | / _ \\  \\ V / 
  \\_/   |___| |___/ |_||_|/_/ \\_\\  \\_/  
`}
          </pre>
          <div className="flex-1 space-y-0.5 text-inherit">
            <div><span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">OS:</span> VibhavOS v2.6.5</div>
            <div><span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">Shell:</span> zsh 5.9 (omz)</div>
            <div><span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">Theme:</span> {terminalTheme}</div>
            <div><span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">Uptime:</span> Always learning</div>
            <div><span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">Vibe:</span> ⚡ Coding in Dark Mode</div>
            <div><span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">Status:</span> <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-cyan-300">🟢 Open to opportunities</span></div>
          </div>
        </div>
      );
    } else if (trimmed === 'skills') {
      outputNode = (
        <div className="space-y-1 text-inherit opacity-90">
          <div className="opacity-50">Technical Proficiencies:</div>
          <div className="space-y-0.5 pl-2 font-mono text-[10px]">
            <div>TypeScript  <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">[████████░░]</span> 80%</div>
            <div>React/Next   <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-cyan-400 font-semibold">[█████████░]</span> 90%</div>
            <div>Tailwind CSS <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">[██████████]</span> 100%</div>
            <div>Node/Express <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-cyan-400 font-semibold">[███████░░░]</span> 70%</div>
            <div>PostgreSQL   <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">[████████░░]</span> 80%</div>
          </div>
        </div>
      );
    } else if (trimmed === 'logs' || trimmed === 'dev.log') {
      outputNode = (
        <div className="space-y-2 text-inherit opacity-90">
          <div className="opacity-50 font-semibold">Developer Timeline (dev.log):</div>
          <div className="space-y-2 pl-2">
            <div>
              <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">[2026-05] Interactive Terminal Shell</span>
              <div className="pl-3 text-[10px] opacity-60">• Added custom history cycling with Arrow keys</div>
              <div className="pl-3 text-[10px] opacity-60">• Integrated cyberpunk & hacker themes and Matrix Code Rain canvas</div>
              <div className="pl-3 text-[10px] opacity-60">• Coded an interactive Guess the Number game</div>
            </div>
            <div>
              <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold">[2026-05] Redesigned Portfolio UI</span>
              <div className="pl-3 text-[10px] opacity-60">• Grid layouts, bento box cards, interactive cursor gradients</div>
            </div>
            <div>
              <span className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold">[2026-04] Database & Admin Dashboard</span>
              <div className="pl-3 text-[10px] opacity-60">• Connected Supabase DB for dynamic project counts</div>
              <div className="pl-3 text-[10px] opacity-60">• Built admin/dashboard for easier work management</div>
            </div>
            <div>
              <span className="text-emerald-400 hacker:text-emerald-400 cyberpunk:text-cyan-400 font-semibold">[2026-03] Modern Web Architect</span>
              <div className="pl-3 text-[10px] opacity-60">• Created high performance Next.js template</div>
            </div>
          </div>
        </div>
      );
    } else if (trimmed === 'git' || trimmed === 'git.log' || trimmed === 'git log') {
      outputNode = (
        <div className="font-mono text-[9px] leading-relaxed space-y-1 text-inherit opacity-90">
          <div className="opacity-50 mb-1">Git Log Tree:</div>
          <div>
            <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-pink-400 font-bold">*</span> <span className="text-yellow-400 font-bold">5a7d2e9</span> <span className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-cyan-400 font-semibold">(HEAD {"->"} main, origin/main)</span>
            <span className="opacity-75"> feat: improve dev.log interactive shell</span>
          </div>
          <div className="text-cyan-400 hacker:text-emerald-600 cyberpunk:text-pink-500">{"|\\"}</div>
          <div>
            <span className="text-cyan-400 hacker:text-emerald-600 cyberpunk:text-pink-500">|</span> <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-pink-400 font-bold">*</span> <span className="text-yellow-400 font-bold">3c8b1a4</span>
            <span className="opacity-75"> feat: implement cyberpunk/hacker themes and matrix rain canvas</span>
          </div>
          <div>
            <span className="text-cyan-400 hacker:text-emerald-600 cyberpunk:text-pink-500">|</span> <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-pink-400 font-bold">*</span> <span className="text-yellow-400 font-bold">2d1f0e9</span>
            <span className="opacity-75"> feat: build interactive guess game mode</span>
          </div>
          <div className="text-cyan-400 hacker:text-emerald-600 cyberpunk:text-pink-500">{"|/"}</div>
          <div>
            <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-pink-400 font-bold">*</span> <span className="text-yellow-400 font-bold">a3f8b9e</span>
            <span className="opacity-75"> feat: craft gorgeous bento grid portfolio & interactive card gradients</span>
          </div>
          <div>
            <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-pink-400 font-bold">*</span> <span className="text-yellow-400 font-bold">1d2e3f4</span>
            <span className="opacity-75"> chore: connect Supabase dynamic metrics updates</span>
          </div>
          <div className="opacity-40 mt-1">
            5 commits • 1 author (Vibhav Patel)
          </div>
        </div>
      );
    } else if (trimmed === 'status' || trimmed === 'status.sh') {
      outputNode = (
        <div className="space-y-1 text-inherit opacity-90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-cyan-300 font-semibold">active (running)</span>
          </div>
          <div className="space-y-0.5 opacity-80">
            <div>☕ Coffee Level: 92%</div>
            <div>🔋 Focus Mode: Locked in</div>
            <div>📡 Location: India</div>
          </div>
        </div>
      );
    } else if (trimmed === 'contact') {
      outputNode = (
        <div className="space-y-1 text-inherit opacity-90 pl-2">
          <div className="opacity-50">Get in touch:</div>
          <div>GitHub: <a href="https://github.com/Vibhav" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 hover:underline">github.com/Vibhav</a></div>
          <div>LinkedIn: <a href="https://www.linkedin.com/in/vibhav-patel/" target="_blank" rel="noopener noreferrer" className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 hover:underline">linkedin.com/in/vibhav-patel</a></div>
          <div>Instagram: <a href="https://www.instagram.com/Vibhav" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hacker:text-emerald-400 cyberpunk:text-pink-400 hover:underline">@Vibhav</a></div>
          <div>TikTok: <a href="https://www.tiktok.com/@Vibhav" target="_blank" rel="noopener noreferrer" className="text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 hover:underline">@Vibhav</a></div>
        </div>
      );
    } else if (trimmed === 'matrix') {
      setMatrixActive(true);
      outputNode = (
        <div className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-pink-400 font-semibold">
          Launching Matrix code rain...
        </div>
      );
    } else if (trimmed === 'coffee') {
      outputNode = (
        <div className="space-y-2 text-inherit opacity-90">
          <pre className="text-amber-500 hacker:text-emerald-500 cyberpunk:text-pink-500 font-bold leading-none select-none">
            {`   (  )   (   )  )
    ) (   )  (  (
    ( )  (    ) )
  .============.
  |            |===.
  |   COFFEE   |   |
  |            |___|
  \\            /
   \`==========\``}
          </pre>
          <div className="text-amber-200 hacker:text-emerald-300 cyberpunk:text-yellow-200">
            Coffee brewed successfully! Focus level set to maximum. ☕
          </div>
        </div>
      );
    } else if (trimmed.startsWith('sudo')) {
      const sub = trimmed.replace('sudo', '').trim();
      if (sub === 'matrix') {
        setMatrixActive(true);
        outputNode = <div className="text-emerald-400 font-semibold">Executing Matrix in administrator mode...</div>;
      } else {
        outputNode = (
          <div className="space-y-1 font-mono text-[10px]">
            <div className="text-red-400 font-semibold">[sudo] password for guest: **********</div>
            <div className="text-yellow-500 hacker:text-emerald-500 cyberpunk:text-pink-400">
              guest is not in the sudoers file. This incident has been reported to Santa Claus. 🎅
            </div>
          </div>
        );
      }
    } else if (trimmed.startsWith('theme')) {
      const args = trimmed.split(' ');
      if (args.length === 1) {
        outputNode = (
          <div className="space-y-1 text-inherit">
            <div className="opacity-50">Current Theme: {terminalTheme}</div>
            <div>Available themes: <span className="font-semibold text-white">classic</span>, <span className="font-semibold text-pink-400">cyberpunk</span>, <span className="font-semibold text-emerald-400">hacker</span></div>
            <div className="opacity-45">Usage: theme [themeName] (e.g. 'theme cyberpunk')</div>
          </div>
        );
      } else {
        const selectedTheme = args[1];
        if (selectedTheme === 'classic' || selectedTheme === 'cyberpunk' || selectedTheme === 'hacker') {
          setTerminalTheme(selectedTheme);
          outputNode = (
            <div className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-cyan-300 font-semibold">
              Theme changed to '{selectedTheme}' successfully.
            </div>
          );
        } else {
          outputNode = (
            <div className="text-red-400 font-semibold">
              Unknown theme: {selectedTheme}. Available themes: classic, cyberpunk, hacker.
            </div>
          );
        }
      }
    } else if (trimmed === 'guess') {
      setGameActive(true);
      const targetNum = Math.floor(Math.random() * 100) + 1;
      setTargetNumber(targetNum);
      setAttempts(0);
      outputNode = (
        <div className="space-y-1.5 text-inherit">
          <div className="text-yellow-400 font-bold">🎮 Guess the Number Mini-Game Started!</div>
          <div>I have selected a secret number between <span className="font-semibold text-white">1</span> and <span className="font-semibold text-white">100</span>.</div>
          <div>Enter your guess below or type <span className="text-red-400 font-semibold">exit</span> to quit.</div>
        </div>
      );
    } else if (trimmed === 'clear') {
      // Reset terminal to initial neofetch state instead of blanking
      setHistory([
        {
          id: 'clear-welcome-' + Date.now(),
          type: 'output',
          content: (
            <div className="text-white/40 mb-1">
              Welcome to VibhavOS Terminal v2.6.5! Type 'help' for command list.
            </div>
          )
        },
        {
          id: 'clear-cmd-' + Date.now(),
          type: 'input',
          content: 'neofetch'
        },
        {
          id: 'clear-neofetch-' + Date.now(),
          type: 'output',
          content: (
            <div className="flex flex-col sm:flex-row gap-4 items-start font-mono text-[9px] md:text-[10px]">
              <pre className={`text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-bold leading-tight select-none shrink-0`}>
                {`
__      ___   ___   _  _    _    __   __
\\ \\ / / |_ _| | _ ) | || |  / \\  \\ \\ / /
 \\ V /   | |  | _ \\ | __ | / _ \\  \\ V / 
  \\_/   |___| |___/ |_||_|/_/ \\_\\  \\_/  
`}
              </pre>
              <div className="flex-1 space-y-0.5 text-inherit">
                <div><span className={`text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold`}>OS:</span> VibhavOS v2.6.5</div>
                <div><span className={`text-indigo-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold`}>Shell:</span> zsh 5.9 (omz)</div>
                <div><span className={`text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold`}>Theme:</span> {terminalTheme}</div>
                <div><span className={`text-indigo-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold`}>Uptime:</span> Always learning</div>
                <div><span className={`text-violet-400 hacker:text-emerald-400 cyberpunk:text-pink-400 font-semibold`}>Vibe:</span> ⚡ Coding in Dark Mode</div>
                <div><span className={`text-indigo-400 hacker:text-emerald-400 cyberpunk:text-yellow-400 font-semibold`}>Status:</span> <span className="text-emerald-400 hacker:text-emerald-300 cyberpunk:text-cyan-300">🟢 Open to opportunities</span></div>
              </div>
            </div>
          )
        }
      ]);
      setInputVal("");
      return;
    } else {
      outputNode = (
        <div className="text-red-400 font-semibold">
          zsh: command not found: {trimmed}. Type 'help' to see options.
        </div>
      );
    }

    newLines.push({
      id: Date.now() + '-output-' + Math.random().toString(36).substr(2, 5),
      type: 'output',
      content: outputNode
    });

    setHistory(prev => [...prev, ...newLines]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal;
    setInputVal("");
    if (!cmd.trim()) return;

    if (gameActive) {
      // Run game logic
      const trimmed = cmd.trim().toLowerCase();
      const newLines: TerminalLine[] = [];

      newLines.push({
        id: Date.now() + '-input-' + Math.random().toString(36).substr(2, 5),
        type: 'input',
        content: cmd.trim()
      });

      if (trimmed === 'exit' || trimmed === 'quit') {
        setGameActive(false);
        newLines.push({
          id: Date.now() + '-output-' + Math.random().toString(36).substr(2, 5),
          type: 'output',
          content: <div className="text-red-400 font-semibold">Game exited. The target number was {targetNumber}.</div>
        });
      } else {
        const guess = parseInt(trimmed);
        if (isNaN(guess) || guess < 1 || guess > 100) {
          newLines.push({
            id: Date.now() + '-output-' + Math.random().toString(36).substr(2, 5),
            type: 'output',
            content: <div className="text-yellow-400">Please enter a valid number between 1 and 100 or type 'exit'.</div>
          });
        } else {
          const nextAttempts = attempts + 1;
          setAttempts(nextAttempts);

          if (guess === targetNumber) {
            setGameActive(false);
            newLines.push({
              id: Date.now() + '-output-' + Math.random().toString(36).substr(2, 5),
              type: 'output',
              content: (
                <div className="space-y-1 text-emerald-400 font-bold">
                  <div>🎉 Congratulations! You guessed the number!</div>
                  <div>The number was {targetNumber}. It took you {nextAttempts} attempts.</div>
                </div>
              )
            });
          } else if (guess < targetNumber) {
            newLines.push({
              id: Date.now() + '-output-' + Math.random().toString(36).substr(2, 5),
              type: 'output',
              content: <div>Too low! (Attempt {nextAttempts})</div>
            });
          } else {
            newLines.push({
              id: Date.now() + '-output-' + Math.random().toString(36).substr(2, 5),
              type: 'output',
              content: <div>Too high! (Attempt {nextAttempts})</div>
            });
          }
        }
      }

      setHistory(prev => [...prev, ...newLines]);
    } else {
      executeCommand(cmd);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;

      const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputVal(cmdHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex === cmdHistory.length - 1) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputVal(cmdHistory[newIndex]);
      }
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top: terminalBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    fetchStats();

    // Populate with neofetch initially
    setHistory([
      {
        id: 'init-welcome',
        type: 'output',
        content: (
          <div className="text-white/40 mb-1">
            Welcome to VibhavOS Terminal v2.6.5! Type 'help' for command list.
          </div>
        )
      },
      {
        id: 'init-cmd',
        type: 'input',
        content: 'neofetch'
      },
      {
        id: 'init-neofetch',
        type: 'output',
        content: (
          <div className="flex flex-col sm:flex-row gap-4 items-start font-mono text-[9px] md:text-[10px]">
            <pre className="text-violet-400 font-bold leading-tight select-none shrink-0">
              {`
__      ___   ___   _  _    _    __   __
\\ \\ / / |_ _| | _ ) | || |  / \\  \\ \\ / /
 \\ V /   | |  | _ \\ | __ | / _ \\  \\ V / 
  \\_/   |___| |___/ |_||_|/_/ \\_\\  \\_/  
`}
            </pre>
            <div className="flex-1 space-y-0.5 text-white/80">
              <div><span className="text-violet-400 font-semibold">OS:</span> VibhavOS v2.6.5</div>
              <div><span className="text-indigo-400 font-semibold">Shell:</span> zsh 5.9 (omz)</div>
              <div><span className="text-violet-400 font-semibold">Theme:</span> classic</div>
              <div><span className="text-indigo-400 font-semibold">Uptime:</span> Always learning</div>
              <div><span className="text-violet-400 font-semibold">Vibe:</span> ⚡ Coding in Dark Mode</div>
              <div><span className="text-indigo-400 font-semibold">Status:</span> <span className="text-emerald-400">🟢 Open to opportunities</span></div>
            </div>
          </div>
        )
      }
    ]);

    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchStats = async () => {
    if (isPlaceholder) {
      setProjectCount(mockProjects.length);
      setCertificateCount(mockCertificates.length);
      return;
    }
    try {
      const { count: projects } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });

      const { count: certificates } = await supabase
        .from("certificates")
        .select("*", { count: "exact", head: true });

      // Fall back to mock data counts when DB returns 0 or null
      setProjectCount((projects && projects > 0) ? projects : mockProjects.length);
      setCertificateCount((certificates && certificates > 0) ? certificates : mockCertificates.length);
    } catch {
      // On error, still show mock data counts instead of 0
      setProjectCount(mockProjects.length);
      setCertificateCount(mockCertificates.length);
    }
  };

  const scrollToPortfolio = () => {
    const el = document.getElementById("portfolio");
    if (el) {
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 20;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (!mounted) return null;

  // Stagger variants for Bento cards
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 14,
      },
    },
  };

  return (
    <section
      id="about"
      className="min-h-screen flex items-center py-20 px-6 md:pl-[120px] md:pr-[60px]"
    >
      <div className="w-full max-w-[1300px] mx-auto">
        {/* Section title */}
        <div className="mb-10 text-left">
          <span
            style={{ fontFamily: "'DM Mono', monospace" }}
            className="text-[11px] text-white/40 tracking-[0.2em] uppercase block mb-2"
          >
            ✦ PROFILE
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            About Me
          </h2>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Card 1: Main Bio (Col Span 2) */}
          <motion.div
            variants={cardVariants}
            className="card-glow-wrapper md:col-span-2 p-8 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-4">
              <span
                style={{ fontFamily: "'DM Mono', monospace" }}
                className="text-[11px] text-white/40 tracking-wider uppercase"
              >
                BIOGRAPHY
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Vibhav Patel
              </h3>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-[620px]">
                I am a passionate Computer Science undergraduate with a strong foundation in software engineering and a drive for innovation. My expertise spans across full-stack development, building scalable community systems, and creating seamless user experiences with modern web technologies. I am committed to continuous learning and delivering high-quality digital solutions.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  "Full Stack Development",
                  "Clean Code Enthusiast",
                  "Scalable Systems",
                  "Community Systems",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                    className="text-[10px] bg-white/[0.04] text-white/60 border border-white/5 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-8 flex-wrap">
              <a
                href="https://drive.google.com/file/d/1cFqZ0TY0U0I51K0Tchv8E4sbOv5yAZ9x/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline inline-block"
              >
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-semibold cursor-pointer hover:bg-white/90 transition-all shadow-lg shadow-white/5"
                >
                  <FileText size={15} />
                  Download CV
                </motion.button>
              </a>

              <motion.button
                onClick={scrollToPortfolio}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-transparent border border-white/20 hover:border-white/40 text-white text-sm font-semibold cursor-pointer hover:bg-white/5 transition-all"
              >
                <ArrowUpRight size={15} />
                View Projects
              </motion.button>
            </div>
          </motion.div>

          {/* Card 2: Interactive Profile Photo (Col Span 1) */}
          <motion.div
            variants={cardVariants}
            className="card-glow-wrapper md:col-span-1 p-6 flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]"
          >
            {/* Spinning decorative ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity duration-500">
              <div className="w-[260px] h-[260px] rounded-full border border-dashed border-white/10 animate-spin-slow" />
              <div
                className="absolute w-[220px] h-[220px] rounded-full border border-double border-white/5 animate-spin-slow"
                style={{ animationDirection: "reverse" }}
              />
            </div>

            {/* Glowing orb background */}
            <div className="absolute w-[180px] h-[180px] rounded-full bg-violet-500/5 blur-3xl group-hover:bg-violet-500/10 transition duration-500" />

            <div className="relative p-2.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl group-hover:border-white/20 transition-colors duration-500">
              <div
                className="w-40 h-40 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/5 to-violet-500/10 border border-dashed border-white/20 group-hover:border-violet-400/40 transition-all duration-700"
              >
                <User size={52} className="text-white/25 group-hover:text-white/40 transition-colors duration-500" strokeWidth={1.2} />
                <span
                  style={{ fontFamily: "'DM Mono', monospace" }}
                  className="text-[9px] tracking-[0.2em] text-white/20 group-hover:text-white/35 transition-colors duration-500 uppercase"
                >
                  placeholder
                </span>
              </div>
            </div>

            <div className="mt-4 text-center z-10">
              <span
                style={{ fontFamily: "'DM Mono', monospace" }}
                className="text-[10px] text-white/40 tracking-[0.15em] block mb-1"
              >
                LOCATION
              </span>
              <span className="text-xs font-semibold text-white/80 flex items-center gap-1.5 justify-center">
                <MapPin size={11} className="text-white/60" />
                India
              </span>
            </div>
          </motion.div>

          {/* Card 3: Interactive Terminal (Col Span 2) */}
          <motion.div
            variants={cardVariants}
            className={`md:col-span-2 p-5 flex flex-col justify-between font-mono text-[12px] min-h-[380px] h-[380px] relative overflow-hidden group transition-all duration-300 ${styles.containerClass}`}
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {matrixActive && <MatrixRain onClose={() => setMatrixActive(false)} />}

            <div className="flex flex-col h-full overflow-hidden">
              {/* Terminal Header */}
              <div className={`flex items-center justify-between border-b pb-3 mb-3 shrink-0 ${styles.headerClass}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] opacity-40 tracking-wider">
                  Vibhav@portfolio:~
                </span>
              </div>

              {/* Terminal Body */}
              <div
                ref={terminalBodyRef}
                onClick={focusInput}
                className="flex-1 overflow-y-auto pr-1 custom-scroll text-[10px] leading-relaxed select-text space-y-2 mb-2 cursor-text"
              >
                {history.map((line) => (
                  <div key={line.id}>
                    {line.type === 'input' ? (
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${styles.promptClass}`}>{gameActive ? 'guess:~ $' : 'Vibhav@portfolio:~ $'}</span>
                        <span className={styles.textClass}>{line.content}</span>
                      </div>
                    ) : (
                      <div className={styles.textClass}>{line.content}</div>
                    )}
                  </div>
                ))}

                {/* Active prompt line */}
                <form onSubmit={handleFormSubmit} className="flex items-center gap-1.5">
                  <span className={`font-semibold shrink-0 ${styles.promptClass}`}>{gameActive ? 'guess:~ $' : 'Vibhav@portfolio:~ $'}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`flex-1 bg-transparent border-none outline-none font-mono text-[10px] p-0 focus:ring-0 focus:border-none focus:outline-none ${styles.inputClass}`}
                    style={{ caretColor: terminalTheme === 'cyberpunk' ? '#f43f5e' : terminalTheme === 'hacker' ? '#10b981' : 'white' }}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </form>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="flex gap-2 border-t border-white/5 pt-3 mt-auto text-[10px] shrink-0">
              <button
                onClick={() => executeCommand('neofetch')}
                className={`px-2.5 py-1 rounded transition-all duration-300 font-mono cursor-pointer select-none ${styles.buttonClass}`}
              >
                sys.info
              </button>
              <button
                onClick={() => executeCommand('logs')}
                className={`px-2.5 py-1 rounded transition-all duration-300 font-mono cursor-pointer select-none ${styles.buttonClass}`}
              >
                dev.log
              </button>
              <button
                onClick={() => executeCommand('skills')}
                className={`px-2.5 py-1 rounded transition-all duration-300 font-mono cursor-pointer select-none ${styles.buttonClass}`}
              >
                skills.sh
              </button>
              <button
                onClick={() => executeCommand('matrix')}
                className={`px-2.5 py-1 rounded transition-all duration-300 font-mono cursor-pointer select-none ${styles.buttonClass}`}
              >
                matrix
              </button>
            </div>
          </motion.div>


          {/* Card 4: Stats Hub (Col Span 1) */}
          <motion.div
            variants={cardVariants}
            className="card-glow-wrapper md:col-span-1 p-5 flex flex-col justify-between min-h-[250px]"
          >
            <div className="flex flex-col gap-3">
              <span
                style={{ fontFamily: "'DM Mono', monospace" }}
                className="text-[11px] text-white/40 tracking-wider uppercase"
              >
                METRICS
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition duration-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 text-white/70">
                      <Code size={14} />
                    </div>
                    <span
                      style={{ fontFamily: "'DM Mono', monospace" }}
                      className="text-xs text-white/80 font-semibold"
                    >
                      Projects
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white pr-1">
                    {projectCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition duration-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 text-white/70">
                      <Award size={14} />
                    </div>
                    <span
                      style={{ fontFamily: "'DM Mono', monospace" }}
                      className="text-xs text-white/80 font-semibold"
                    >
                      Certificates
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white pr-1">
                    {certificateCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition duration-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 text-white/70">
                      <Globe size={14} />
                    </div>
                    <span
                      style={{ fontFamily: "'DM Mono', monospace" }}
                      className="text-xs text-white/80 font-semibold"
                    >
                      Completed
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white pr-1">
                    {projectCount + certificateCount}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-[10px] text-white/30 text-right mt-2"
            >
              Live updates via DB
            </div>
          </motion.div>

          {/* Card 5: Creative Quote / Philosophy (Col Span 3) */}
          <motion.div
            variants={cardVariants}
            className="card-glow-wrapper md:col-span-3 p-8 flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden group min-h-[150px] gap-6"
          >
            {/* Ambient subtle glow inside card */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="flex flex-col gap-2 z-10">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={16}
                  className="text-white/40 group-hover:text-white/70 transition duration-300"
                />
                <span
                  style={{ fontFamily: "'DM Mono', monospace" }}
                  className="text-[9px] text-white/30 tracking-widest uppercase"
                >
                  Philosophy
                </span>
              </div>
              <p className="text-base md:text-lg italic text-white/80 font-medium leading-relaxed max-w-[700px] mt-2">
                “Turning complex programming challenges into smooth, interactive,
                and beautiful user interfaces.”
              </p>
            </div>

            <div
              style={{ fontFamily: "'DM Mono', monospace" }}
              className="text-[10px] text-white/40 tracking-wider md:text-right z-10 shrink-0 self-end md:self-center"
            >
              Aesthetics + Performance
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
