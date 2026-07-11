import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Info, ToggleLeft, ShieldAlert, RotateCw, 
  HelpCircle, Sliders, Settings, Radio, HelpCircle as HelpIcon 
} from 'lucide-react';
import { Malfunction } from '../data/malfunctions';

interface FaultDiagramProps {
  fault: Malfunction;
  batteryActive?: boolean;
  pantoActive?: boolean;
  vcbClosed?: boolean;
  b09Isolated?: boolean;
  parkingBrakeIsolated?: boolean;
  pullCordPulled?: boolean;
  eblbBypassed?: boolean;
  doorIsolated?: boolean;
  doorUnlocked?: boolean;
  acLocalMode?: boolean;
  acMode?: 'auto' | 'full' | 'semi' | 'vent';
}

export default function FaultDiagram({
  fault,
  batteryActive = true,
  pantoActive = true,
  vcbClosed = true,
  b09Isolated = false,
  parkingBrakeIsolated = false,
  pullCordPulled = false,
  eblbBypassed = false,
  doorIsolated = false,
  doorUnlocked = false,
  acLocalMode = false,
  acMode = 'auto'
}: FaultDiagramProps) {
  
  const type = fault.imageType;

  // Helper to render responsive, beautiful SVG schematics based on type
  const renderSvgContent = () => {
    switch (type) {
      case 'catenary_chart':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {/* Background */}
            <rect width="400" height="200" fill="url(#skyGrad)" rx="12" />
            
            {/* Grid Lines */}
            <path d="M 0,40 L 400,40" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M 0,150 L 400,150" stroke="#1e293b" strokeWidth="1" />

            {/* Catenary Wire (25kV AC) */}
            <path d="M 0,30 L 400,30" stroke="#f59e0b" strokeWidth="2.5" filter={pantoActive ? "url(#glow)" : ""} />
            {pantoActive && (
              <motion.path 
                d="M 0,30 L 400,30" 
                stroke="#fbbf24" 
                strokeWidth="4.5" 
                strokeDasharray="15 30"
                animate={{ strokeDashoffset: [-100, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                filter="url(#glow)"
                opacity="0.8"
              />
            )}
            <text x="380" y="24" fill="#fbbf24" className="text-[9px] font-mono font-bold text-right" textAnchor="end">25kV OCS / شبكة هوائية ⚡</text>

            {/* Train Roof Outline */}
            <path d="M 50,150 L 50,110 Q 50,100 70,95 L 330,95 Q 350,100 350,110 L 350,150 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            <rect x="70" y="115" width="50" height="20" rx="2" fill="#334155" />
            <rect x="280" y="115" width="50" height="20" rx="2" fill="#334155" />
            <text x="200" y="130" fill="#64748b" className="text-[8px] font-bold" textAnchor="middle">سقف العربة الموتور (M-Car Roof)</text>

            {/* Pantograph Structure */}
            <g transform="translate(160, 95)">
              {/* Bottom mount */}
              <rect x="15" y="-4" width="50" height="4" fill="#64748b" />
              {/* Lower arm */}
              <motion.line 
                x1="25" y1="-4" 
                x2={pantoActive ? "40" : "55"} 
                y2={pantoActive ? "-40" : "-10"} 
                stroke={pantoActive ? "#10b981" : "#ef4444"} 
                strokeWidth="3.5" 
                animate={pantoActive ? { x2: [40, 42, 40] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              {/* Upper arm */}
              <motion.line 
                x1={pantoActive ? "40" : "55"} 
                y1={pantoActive ? "-40" : "-10"} 
                x2="40" 
                y2={pantoActive ? "-65" : "-12"} 
                stroke={pantoActive ? "#10b981" : "#ef4444"} 
                strokeWidth="2.5" 
                animate={pantoActive ? { x1: [40, 42, 40] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              {/* Carbon contact shoe */}
              <rect 
                x="20" 
                y={pantoActive ? "-68" : "-14"} 
                width="40" 
                height="3" 
                fill="#94a3b8" 
                stroke={pantoActive ? "#fbbf24" : "#475569"} 
                strokeWidth="1.5" 
                filter={pantoActive ? "url(#glow)" : ""}
              />
              {/* Spark effects if panto is active */}
              {pantoActive && (
                <motion.circle 
                  cx="40" cy="-66" r="3" fill="#fbbf24" 
                  animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
              )}
            </g>

            {/* Vacuum Circuit Breaker (VCB) schematic inside car */}
            <g transform="translate(80, 110)">
              {/* Box casing */}
              <rect width="70" height="30" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <text x="35" y="11" fill="#94a3b8" className="text-[7px] font-bold" textAnchor="middle">قاطع تفريغ VCB</text>
              {/* Switch state representation */}
              {vcbClosed ? (
                <>
                  <line x1="15" y1="20" x2="55" y2="20" stroke="#10b981" strokeWidth="3" filter="url(#glow)" />
                  <circle cx="15" cy="20" r="4" fill="#10b981" />
                  <circle cx="55" cy="20" r="4" fill="#10b981" />
                  <text x="35" y="27" fill="#10b981" className="text-[7px] font-mono font-bold" textAnchor="middle">CLOSED / مغلق 🟢</text>
                </>
              ) : (
                <>
                  <line x1="15" y1="20" x2="35" y2="20" stroke="#ef4444" strokeWidth="2.5" />
                  <line x1="35" y1="20" x2="50" y2="10" stroke="#ef4444" strokeWidth="2.5" />
                  <circle cx="15" cy="20" r="4" fill="#ef4444" />
                  <circle cx="55" cy="20" r="4" fill="#ef4444" />
                  <text x="35" y="27" fill="#ef4444" className="text-[7px] font-mono font-bold" textAnchor="middle">TRIPPED / مفصول 🔴</text>
                </>
              )}
            </g>

            {/* HVIS (High Voltage Isolation Switch) */}
            <g transform="translate(250, 110)">
              <rect width="60" height="30" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <text x="30" y="11" fill="#94a3b8" className="text-[7px] font-bold" textAnchor="middle">عازل الجهد العالي</text>
              <line x1="15" y1="20" x2="45" y2="20" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="15" cy="20" r="3" fill="#38bdf8" />
              <circle cx="45" cy="20" r="3" fill="#38bdf8" />
              <text x="30" y="26" fill="#38bdf8" className="text-[6px] font-bold" textAnchor="middle">HVIS SWITCH</text>
            </g>

            {/* High Voltage Transformer lines */}
            <path d="M 200,95 L 200,105 L 115,105 L 115,110" stroke="#64748b" strokeWidth="2" fill="none" />
            <path d="M 150,125 L 280,125" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* Status Panel Label Overlay */}
            <rect x="10" y="165" width="380" height="28" rx="6" fill="#1e293b/80" stroke="#334155" strokeWidth="1" />
            <text x="370" y="182" fill="#e2e8f0" className="text-[8px] font-arabic font-black" textAnchor="end">
              شكل ⚡: دائرة التغذية الكهربائية الرئيسية من الشبكة الهوائية العلوية 25 كيلو فولت إلى قاطع الـ VCB الرئيسي بسقف القطار.
            </text>
          </svg>
        );

      case 'speed_sensor':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blueprintGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0b1329" />
                <stop offset="100%" stopColor="#1c2541" />
              </linearGradient>
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#blueprintGrad)" rx="12" />

            {/* Rail line */}
            <line x1="10" y1="165" x2="390" y2="165" stroke="#475569" strokeWidth="5" />
            <line x1="10" y1="170" x2="390" y2="170" stroke="#334155" strokeWidth="2" />

            {/* Giant Wheel Center Axle */}
            <g transform="translate(130, 110)">
              {/* Outer wheel tread */}
              <circle cx="0" cy="0" r="50" stroke="#94a3b8" strokeWidth="7.5" fill="#1e293b" />
              {/* Inner wheel structure */}
              <circle cx="0" cy="0" r="40" stroke="#475569" strokeWidth="3" fill="#0f172a" />
              <path d="M -40,0 L 40,0 M 0,-40 L 0,40" stroke="#334155" strokeWidth="2" />
              <circle cx="0" cy="0" r="15" fill="#334155" stroke="#475569" strokeWidth="2" />
              
              {/* Rotational motion indicators */}
              <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <circle cx="28" cy="0" r="4" fill="#fbbf24" />
                <line x1="0" y1="0" x2="30" y2="30" stroke="#475569" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-30" y2="-30" stroke="#475569" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="30" y2="-30" stroke="#475569" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-30" y2="30" stroke="#475569" strokeWidth="1.5" />
              </motion.g>
              <text x="0" y="4" fill="#e2e8f0" className="text-[7px] font-bold" textAnchor="middle">السرعة</text>
            </g>

            {/* Axle Box with Speed Sensor */}
            <g transform="translate(240, 110)">
              {/* Toothed Pulse Wheel (القرص المسنن) */}
              <circle cx="0" cy="0" r="28" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" fill="#0f172a" />
              <motion.circle 
                cx="0" cy="0" r="28" 
                stroke="#64748b" 
                strokeWidth="2.5" 
                strokeDasharray="6 3" 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
              />
              <circle cx="0" cy="0" r="10" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

              {/* Sensor Probe (حساس السرعة المزدوج) */}
              <g transform="translate(25, -20)">
                {/* Mount bracket */}
                <path d="M -15,10 L 0,-10 L 15,-10" stroke="#64748b" strokeWidth="2.5" fill="none" />
                {/* Sensor probe head */}
                <rect x="-8" y="5" width="16" height="22" rx="2" fill="#334155" stroke="#10b981" strokeWidth="1.5" />
                {/* Gap 1.2mm highlight */}
                <line x1="-15" y1="27" x2="-2" y2="27" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
                <text x="-18" y="31" fill="#10b981" className="text-[5px] font-mono font-bold">1.2mm Gap</text>
                
                {/* Active signals */}
                <motion.path 
                  d="M -3,29 L 3,29 M -5,32 L 5,32" 
                  stroke="#10b981" 
                  strokeWidth="1" 
                  animate={{ opacity: [0.2, 1, 0.2] }} 
                  transition={{ repeat: Infinity, duration: 0.5 }} 
                  filter="url(#glowGreen)"
                />
                
                {/* Cable leading away */}
                <path d="M 0,-10 C 10,-20 20,-10 40,-15" stroke="#10b981" strokeWidth="2" fill="none" filter="url(#glowGreen)" />
              </g>

              {/* Annotation labels */}
              <text x="50" y="-35" fill="#10b981" className="text-[7px] font-arabic font-black" textAnchor="start">مستشعر السرعة المزدوج</text>
              <text x="50" y="-25" fill="#94a3b8" className="text-[6px] font-arabic font-bold" textAnchor="start">Double Speed Sensor</text>
              <text x="-40" y="-35" fill="#38bdf8" className="text-[7px] font-arabic font-black" textAnchor="end">القرص المسنن للمحور</text>
            </g>

            {/* Junction box & MB03_05 Cabin card */}
            <g transform="translate(320, 45)">
              <rect width="70" height="45" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
              <text x="35" y="11" fill="#e2e8f0" className="text-[7px] font-black font-arabic" textAnchor="middle">لوحة بطاقات العربة</text>
              <rect x="10" y="16" width="50" height="8" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
              <text x="35" y="22" fill="#10b981" className="text-[6px] font-mono font-bold" textAnchor="middle">MB03_05 Card</text>
              <circle cx="15" cy="34" r="2.5" fill="#10b981" className="animate-ping" />
              <circle cx="15" cy="34" r="2.5" fill="#10b981" />
              <text x="24" y="36.5" fill="#94a3b8" className="text-[6px] font-mono font-semibold">Pulse Signal OK</text>
            </g>
            
            {/* Annotation line sensor to card */}
            <path d="M 280,30 L 320,30" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* bottom explanation */}
            <rect x="10" y="176" width="380" height="20" rx="4" fill="#1e293b/60" stroke="#334155" strokeWidth="1" />
            <text x="370" y="188" fill="#cbd5e1" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل ⚙️: آلية قراءة النبضات المغناطيسية من عجلات القطار وحساس السرعة، وارتباطها ببطاقة المعالجة MB03_05 بالصالون.
            </text>
          </svg>
        );

      case 'air_brake':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brakeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#080705" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>
              <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#brakeGrad)" rx="12" />

            {/* Saloon Seats Silhouette */}
            <path d="M 30,140 L 120,140 L 120,115 L 140,115 L 140,150 L 30,150 Z" fill="#292524" stroke="#44403c" strokeWidth="1.5" />
            <path d="M 40,115 L 110,115 L 110,80 L 125,80 L 125,115" stroke="#44403c" strokeWidth="1.5" fill="none" />
            <text x="80" y="130" fill="#78716c" className="text-[8px] font-black font-arabic" textAnchor="middle">المقعد الخماسي بالصالون</text>

            {/* Floor board line */}
            <line x1="10" y1="150" x2="390" y2="150" stroke="#57534e" strokeWidth="3" />

            {/* B09 Valve under the seat */}
            <g transform="translate(180, 115)">
              {/* Outer circle for panel cutout */}
              <circle cx="0" cy="0" r="35" fill="#1c1917" stroke="#44403c" strokeWidth="2" />
              <rect x="-35" y="-35" width="70" height="70" rx="8" stroke="#57534e" strokeWidth="1.5" fill="none" />
              <text x="0" y="-22" fill="#e7e5e4" className="text-[8px] font-black font-arabic" textAnchor="middle">مقبض صمام العزل B09</text>
              <text x="0" y="-12" fill="#78716c" className="text-[6px] font-bold" textAnchor="middle">AIR BRAKE CUT-OUT B09</text>

              {/* Pipe connection */}
              <path d="M -50,15 C -40,15 -10,15 0,15" stroke="#ef4444" strokeWidth="4" fill="none" />
              <path d="M 0,15 C 10,15 40,15 50,15" stroke={b09Isolated ? "#78716c" : "#ef4444"} strokeWidth="4" fill="none" />
              
              {/* Valve handle (B09 Handle) */}
              <g transform={b09Isolated ? "rotate(90)" : "rotate(0)"}>
                {/* Red heavy rotating lever */}
                <rect x="-24" y="-7" width="48" height="14" rx="7" fill="#ef4444" stroke="#ffffff" strokeWidth="1" filter="url(#glowRed)" />
                <circle cx="0" cy="0" r="10" fill="#78716c" stroke="#e7e5e4" strokeWidth="2" />
                <circle cx="0" cy="0" r="3" fill="#ffffff" />
                {/* Direction arrow */}
                <line x1="15" y1="0" x2="20" y2="0" stroke="#ffffff" strokeWidth="2" />
              </g>

              {/* Status Indicator text on panel */}
              <text x="-42" y="4" fill="#10b981" className="text-[7px] font-arabic font-extrabold" textAnchor="end">أفقي = تشغيل</text>
              <text x="42" y="4" fill="#ef4444" className="text-[7px] font-arabic font-extrabold" textAnchor="start">رأسي = عزل</text>
            </g>

            {/* Pneumatic pipe lines showing air pressure */}
            <g transform="translate(20, 40)">
              <rect width="110" height="30" rx="4" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
              <text x="55" y="11" fill="#a8a29e" className="text-[7px] font-black font-arabic" textAnchor="middle">الضغط الرئيسي MR</text>
              <text x="55" y="24" fill="#10b981" className="text-[8px] font-mono font-bold" textAnchor="middle">8.5 ~ 9.5 bar 🟢</text>
            </g>

            <g transform="translate(270, 40)">
              <rect width="110" height="30" rx="4" fill="#1c1917" stroke="#44403c" strokeWidth="1.5" />
              <text x="55" y="11" fill="#a8a29e" className="text-[7px] font-black font-arabic" textAnchor="middle">عمود الفرامل BC</text>
              <text x="55" y="24" fill={b09Isolated ? "#ef4444" : "#10b981"} className="text-[8px] font-mono font-bold" textAnchor="middle">
                {b09Isolated ? "0.0 bar [معزول]" : "Normal 🟢"}
              </text>
            </g>

            {/* Connectors and arrows */}
            <path d="M 130,55 L 150,55 L 150,115" stroke="#ef4444" strokeWidth="2.5" fill="none" />
            <path d="M 210,115 L 210,55 L 270,55" stroke={b09Isolated ? "#78716c" : "#ef4444"} strokeWidth="2.5" fill="none" />

            {/* Bottom tag */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#292524/80" stroke="#44403c" strokeWidth="1" />
            <text x="370" y="187" fill="#d6d3d1" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل 🛑: صمام عزل الفرامل B09 المتواجد تحت المقعد الخماسي الثاني بالعربة الموتور لعزل فرامل العربة التالفة.
            </text>
          </svg>
        );

      case 'parking_brake':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="chassisGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#090514" />
                <stop offset="100%" stopColor="#120d24" />
              </linearGradient>
              <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#chassisGrad)" rx="12" />

            {/* Bogie Chassis Illustration */}
            <rect x="50" y="120" width="300" height="30" rx="4" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
            <circle cx="90" cy="145" r="22" fill="#0f172a" stroke="#475569" strokeWidth="4" />
            <circle cx="310" cy="145" r="22" fill="#0f172a" stroke="#475569" strokeWidth="4" />
            <text x="200" y="138" fill="#4338ca" className="text-[8px] font-extrabold" textAnchor="middle">BOGIE FRAME / إطار البوجي السفلي</text>

            {/* Parking Brake Spring Cylinder */}
            <g transform="translate(140, 95)">
              <rect width="50" height="25" rx="3" fill="#312e81" stroke="#4f46e5" strokeWidth="1.5" />
              <text x="25" y="10" fill="#93c5fd" className="text-[6px] font-bold" textAnchor="middle">أسطوانة فرامل التوقف</text>
              <line x1="50" y1="12.5" x2="70" y2="12.5" stroke="#94a3b8" strokeWidth="4" />
              {/* Internal heavy spring illustration */}
              <path d="M 5,12.5 Q 10,5 15,12.5 Q 20,20 25,12.5 Q 30,5 35,12.5 Q 40,20 45,12.5" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            </g>

            {/* Red Pull Cord Ring (حلقة تحرير مكابح التوقف يدوياً) */}
            <g transform="translate(240, 90)">
              <rect x="-1" y="0" width="3" height="35" fill="#ef4444" />
              {/* Hanging Red Ring */}
              <circle cx="0.5" cy="42" r="10" stroke="#ef4444" strokeWidth="3.5" fill="none" className={pullCordPulled ? "animate-pulse" : ""} />
              <path d="M -5,35 L 6,35" stroke="#ef4444" strokeWidth="1.5" />
              <text x="18" y="45" fill="#ef4444" className="text-[7px] font-arabic font-black" textAnchor="start">حلقة التحرير اليدوي الحمراء</text>
              <text x="18" y="53" fill="#64748b" className="text-[5.5px] font-mono font-bold" textAnchor="start">PULL RING TO RELEASE</text>
            </g>

            {/* Cabin switch EBLB and Isolation Valve B01.07 */}
            <g transform="translate(40, 25)">
              <rect width="130" height="50" rx="6" fill="#020617" stroke="#1e1b4b" strokeWidth="2" />
              <text x="65" y="12" fill="#93c5fd" className="text-[7px] font-black font-arabic" textAnchor="middle">صمام عزل فرامل التوقف B01.07</text>
              {parkingBrakeIsolated ? (
                <>
                  <circle cx="35" cy="32" r="6" fill="#ef4444" />
                  <text x="47" y="34.5" fill="#ef4444" className="text-[7px] font-arabic font-black">ISOLATED / معزول 🔴</text>
                </>
              ) : (
                <>
                  <circle cx="35" cy="32" r="6" fill="#10b981" />
                  <text x="47" y="34.5" fill="#10b981" className="text-[7px] font-arabic font-black">IN SERVICE / بالخدمة 🟢</text>
                </>
              )}
            </g>

            <g transform="translate(230, 25)">
              <rect width="130" height="50" rx="6" fill="#020617" stroke="#1e1b4b" strokeWidth="2" />
              <text x="65" y="12" fill="#93c5fd" className="text-[7px] font-black font-arabic" textAnchor="middle">مفتاح تجاوز المكابح EBLB بالكابينة</text>
              {eblbBypassed ? (
                <>
                  <rect x="25" y="24" width="22" height="12" rx="3" fill="#f59e0b" />
                  <text x="36" y="32" fill="#000" className="text-[6.5px] font-mono font-black" textAnchor="middle">BYPASS</text>
                  <text x="54" y="32" fill="#f59e0b" className="text-[7px] font-arabic font-black">وضع التجاوز مفعل 🟢</text>
                </>
              ) : (
                <>
                  <rect x="25" y="24" width="22" height="12" rx="3" fill="#1e293b" />
                  <text x="36" y="32" fill="#94a3b8" className="text-[6.5px] font-mono font-bold" textAnchor="middle">OFF</text>
                  <text x="54" y="32" fill="#94a3b8" className="text-[7px] font-arabic font-black">الوضع العادي [مغلق] 🔒</text>
                </>
              )}
            </g>

            {/* Flow line connection */}
            <path d="M 105,75 L 105,95 L 140,105 M 240,15 L 200,15" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

            {/* Explanation box */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#1e1b4b/60" stroke="#312e81" strokeWidth="1" />
            <text x="370" y="187" fill="#c7d2fe" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل ⭕: سحب حلقة التحرير اليدوي الحمراء أسفل الشاسيه لتحرير مكابح التوقف ميكانيكياً، أو العزل عبر الصمام B01.07.
            </text>
          </svg>
        );

      case 'door_isolation':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="doorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c111d" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
              <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#doorGrad)" rx="12" />

            {/* Saloon Door Frame */}
            <rect x="130" y="55" width="140" height="110" fill="#0f172a" stroke="#475569" strokeWidth="3" />
            {/* Sliding leaf left */}
            <rect x="135" y="60" width="63" height="105" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Sliding leaf right */}
            <rect x="202" y="60" width="63" height="105" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            {/* Glass windows */}
            <rect x="145" y="70" width="43" height="50" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <rect x="212" y="70" width="43" height="50" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <text x="200" y="160" fill="#475569" className="text-[8px] font-black font-arabic" textAnchor="middle">باب صالون الركاب المزدوج</text>

            {/* Top Door Drive Mechanism Cover */}
            <rect x="110" y="25" width="180" height="30" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <text x="200" y="43" fill="#cbd5e1" className="text-[8px] font-black font-arabic" textAnchor="middle">صندوق محرك الباب العلوي (Door Drive Cover)</text>

            {/* Isolation Switch Box (مفتاح العزل المربع) */}
            <g transform="translate(60, 40)">
              <rect width="40" height="40" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <text x="20" y="10" fill="#94a3b8" className="text-[6px] font-bold" textAnchor="middle">مفتاح العزل</text>
              {doorIsolated ? (
                <>
                  <line x1="20" y1="15" x2="20" y2="35" stroke="#ef4444" strokeWidth="3" filter="url(#glowOrange)" />
                  <text x="20" y="32" fill="#ef4444" className="text-[5px] font-mono font-black" textAnchor="middle">ISOLATED</text>
                </>
              ) : (
                <>
                  <line x1="10" y1="25" x2="30" y2="25" stroke="#10b981" strokeWidth="3" />
                  <text x="20" y="32" fill="#10b981" className="text-[5px] font-mono font-black" textAnchor="middle">NORMAL</text>
                </>
              )}
              {/* Square keyhole center */}
              <rect x="17" y="22" width="6" height="6" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
            </g>
            <path d="M 100,40 L 110,40" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
            <text x="40" y="90" fill="#94a3b8" className="text-[7px] font-arabic font-black" textAnchor="start">ادخل المفتاح المربع ولف 90 درجة لعزل الباب كهربائياً.</text>

            {/* Local red indicator LED */}
            <g transform="translate(320, 40)">
              <circle cx="20" cy="20" r="12" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="7" fill={doorIsolated ? "#ef4444" : "#1e293b"} className={doorIsolated ? "animate-pulse" : ""} filter={doorIsolated ? "url(#glowOrange)" : ""} />
              <text x="20" y="-3" fill="#cbd5e1" className="text-[6.5px] font-black font-arabic" textAnchor="middle">مؤشر العزل الأصفر/الأحمر</text>
              <text x="20" y="36" fill={doorIsolated ? "#ef4444" : "#64748b"} className="text-[6px] font-bold" textAnchor="middle">
                {doorIsolated ? "Isolate Active 🔴" : "Inactive 🟢"}
              </text>
            </g>

            {/* Connection line */}
            <path d="M 290,40 L 320,40" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Bottom explain */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#1e293b/60" stroke="#334155" strokeWidth="1" />
            <text x="370" y="187" fill="#cbd5e1" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل 🚪: تدوير مفتاح العزل المربع أعلى الباب يعزل الباب ميكانيكياً وكهربائياً ويضيء لمبة البيان الخارجية الصفراء.
            </text>
          </svg>
        );

      case 'emergency_door':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f0505" />
                <stop offset="100%" stopColor="#2d0f0f" />
              </linearGradient>
              <filter id="glowAlert" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#emGrad)" rx="12" />

            {/* Passenger Cabin Wall Backdrop */}
            <path d="M 0,150 L 400,150" stroke="#3f1a1a" strokeWidth="2" />
            
            {/* Emergency Release Red Box */}
            <g transform="translate(140, 35)">
              <rect width="120" height="110" rx="10" fill="#1c0707" stroke="#dc2626" strokeWidth="3" filter="url(#glowAlert)" />
              <text x="60" y="20" fill="#fca5a5" className="text-[9px] font-black font-arabic" textAnchor="middle">صمام طوارئ الباب يدوياً</text>
              <text x="60" y="31" fill="#7f1d1d" className="text-[6px] font-mono font-bold" textAnchor="middle">EMERGENCY DOOR HANDLE</text>

              {/* Protective Breakable Glass panel */}
              <rect x="15" y="40" width="90" height="55" rx="4" fill="#dc2626/10" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="60" y="55" fill="#f87171" className="text-[6.5px] font-arabic font-extrabold" textAnchor="middle">اكسر الزجاج الواقي</text>
              <text x="60" y="65" fill="#fca5a5" className="text-[6px] font-mono font-bold" textAnchor="middle">BREAK GLASS</text>

              {/* Red Pull Lever handle inside box */}
              <g transform="translate(60, 80)">
                {doorUnlocked ? (
                  <>
                    {/* Pull-down state */}
                    <rect x="-8" y="-10" width="16" height="35" rx="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="0" cy="20" r="6" fill="#ffffff" />
                    {/* Arrow down indicating pulled */}
                    <path d="M 0,-5 L 0,10 M -4,6 L 0,10 L 4,6" stroke="#ffffff" strokeWidth="1.5" fill="none" />
                    <text x="25" y="10" fill="#10b981" className="text-[6px] font-black font-arabic" textAnchor="start">مفتوح / PULLED</text>
                  </>
                ) : (
                  <>
                    {/* Normal locked upright position */}
                    <rect x="-8" y="-20" width="16" height="30" rx="8" fill="#b91c1c" stroke="#dc2626" strokeWidth="1" />
                    <circle cx="0" cy="5" r="5" fill="#ef4444" />
                    <path d="M 0,-15 L 0,-5 M -4,-10 L 0,-15 L 4,-10" stroke="#ffffff" strokeWidth="1" fill="none" />
                    <text x="25" y="-5" fill="#ef4444" className="text-[6px] font-black font-arabic" textAnchor="start">مؤمن / LOCKED</text>
                  </>
                )}
              </g>
            </g>

            {/* Warning sticker nearby */}
            <g transform="translate(20, 60)">
              <rect width="90" height="50" rx="4" fill="#000" stroke="#ef4444" strokeWidth="1.5" />
              <text x="45" y="14" fill="#ef4444" className="text-[7px] font-black font-arabic" textAnchor="middle">🚨 تنبيه هام</text>
              <text x="45" y="27" fill="#cbd5e1" className="text-[6px] font-arabic font-bold" textAnchor="middle">غرامة الاستخدام الخاطئ</text>
              <text x="45" y="38" fill="#f87171" className="text-[5.5px] font-arabic font-bold" textAnchor="middle">للحالات الحرجة فقط!</text>
            </g>

            <g transform="translate(290, 60)">
              <rect width="90" height="50" rx="4" fill="#000" stroke="#ef4444" strokeWidth="1.5" />
              <text x="45" y="15" fill="#fca5a5" className="text-[7px] font-black font-arabic" textAnchor="middle">تأثير السحب</text>
              <text x="45" y="28" fill="#f87171" className="text-[6px] font-arabic font-semibold" textAnchor="middle">يفرغ هواء الباب</text>
              <text x="45" y="39" fill="#94a3b8" className="text-[5px] font-mono font-bold" textAnchor="middle">DE-PRESSURIZE</text>
            </g>

            {/* Bottom tag */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#2d0f0f/80" stroke="#dc2626" strokeWidth="1" />
            <text x="370" y="187" fill="#fca5a5" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل 🚨: صندوق طوارئ الباب اليدوي، يتم كسر زجاج الحماية وسحب المقبض الأحمر لتفريغ الضغط عن الباب وفتحه باليد.
            </text>
          </svg>
        );

      case 'etm_switch':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="etmGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#051c1c" />
                <stop offset="100%" stopColor="#0b2e2e" />
              </linearGradient>
              <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#etmGrad)" rx="12" />

            {/* Wall cabinet mockup */}
            <rect x="50" y="35" width="300" height="115" rx="8" fill="#020808" stroke="#14b8a6" strokeWidth="2" />
            <text x="200" y="25" fill="#2dd4bf" className="text-[10px] font-black font-arabic" textAnchor="middle">خزانة الأجهزة المساعدة خلف كابينة السائق</text>

            {/* ETM Rotary Switch knob */}
            <g transform="translate(130, 90)">
              <circle cx="0" cy="0" r="30" fill="#0c1d1d" stroke="#14b8a6" strokeWidth="1.5" />
              {/* Positions scale marks */}
              <line x1="0" y1="-30" x2="0" y2="-24" stroke="#14b8a6" strokeWidth="2" />
              <line x1="26" y1="15" x2="20" y2="12" stroke="#64748b" strokeWidth="1.5" />
              <text x="0" y="-34" fill="#94a3b8" className="text-[6.5px] font-bold" textAnchor="middle">0 / OFF</text>
              <text x="32" y="24" fill="#14b8a6" className="text-[6.5px] font-black" textAnchor="start">ETM / الجر الاضطراري 🟢</text>
              
              {/* Actual switch pointer shape */}
              <g transform="rotate(45)">
                <rect x="-6" y="-24" width="12" height="32" rx="4" fill="#14b8a6" stroke="#ffffff" strokeWidth="1" filter="url(#glowTeal)" />
                <circle cx="0" cy="-14" r="2" fill="#ffffff" />
                <circle cx="0" cy="0" r="6" fill="#020808" stroke="#14b8a6" strokeWidth="1.5" />
              </g>
              <text x="0" y="4" fill="#2dd4bf" className="text-[7px] font-black font-arabic" textAnchor="middle" transform="translate(0, 42)">مفتاح عزم الجر ETM</text>
            </g>

            {/* VCUCB circuit breaker on right */}
            <g transform="translate(240, 60)">
              <rect width="60" height="60" rx="4" fill="#0c1d1d" stroke="#14b8a6" strokeWidth="1.5" />
              <text x="30" y="12" fill="#2dd4bf" className="text-[7px] font-black font-arabic" textAnchor="middle">قاطع الكنترول</text>
              <text x="30" y="22" fill="#5eead4" className="text-[8px] font-mono font-extrabold" textAnchor="middle">VCUCB</text>
              
              {/* Toggle switch breaker representation */}
              <g transform="translate(30, 42)">
                <rect x="-5" y="-12" width="10" height="24" rx="2" fill="#020808" stroke="#64748b" strokeWidth="1" />
                {/* Active switch arm up */}
                <rect x="-3" y="-11" width="6" height="11" rx="1" fill="#14b8a6" filter="url(#glowTeal)" />
                <text x="12" y="-2" fill="#14b8a6" className="text-[6px] font-mono font-bold" textAnchor="start">ON / UP</text>
              </g>
            </g>

            {/* Bottom explain */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#020808/80" stroke="#14b8a6" strokeWidth="1" />
            <text x="370" y="187" fill="#5eead4" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل 🔌: تدوير مفتاح نمط الجر الاضطراري ETM وتأكيد قاطع الـ VCUCB لتجاوز حظر القيادة في حالات عطل كمبيوتر القطار.
            </text>
          </svg>
        );

      case 'smart_line_ac':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="acGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#022c22" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <filter id="glowTeal2" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#acGrad)" rx="12" />

            {/* Wall Thermostat Mockup (لوحة التكييف Smart-Line) */}
            <g transform="translate(100, 30)">
              {/* Housing frame */}
              <rect width="200" height="120" rx="10" fill="#022c22" stroke="#10b981" strokeWidth="2.5" />
              {/* LCD Display */}
              <rect x="15" y="15" width="170" height="55" rx="4" fill="#065f46" stroke="#047857" strokeWidth="1.5" />
              <text x="175" y="32" fill="#34d399" className="text-[9px] font-black font-arabic" textAnchor="end">شاشة تكييف القطار Smart-Line</text>
              <text x="25" y="30" fill="#34d399" className="text-[6px] font-mono font-bold">HVAC THERMOSTAT CONTROLLER</text>
              
              {/* Mode readout */}
              {acLocalMode ? (
                <>
                  <text x="25" y="46" fill="#fbbf24" className="text-[8px] font-arabic font-black" filter="url(#glowTeal2)">التحكم: يدوي محلي (Local Mode)</text>
                  <text x="25" y="58" fill="#34d399" className="text-[8px] font-arabic font-black">النمط النشط: {acMode === 'full' ? 'تبريد كامل ❄️' : 'تبريد نصفي 🍃'}</text>
                </>
              ) : (
                <>
                  <text x="25" y="46" fill="#10b981" className="text-[8px] font-arabic font-black">التحكم: شبكة مركزي (Network Auto)</text>
                  <text x="25" y="58" fill="#a7f3d0" className="text-[7px] font-arabic font-bold">في انتظار تحويل القواطع والتحويل اليدوي.</text>
                </>
              )}

              {/* Physical control buttons */}
              {/* 1. Local/Network toggle */}
              <g transform="translate(25, 82)">
                <rect width="70" height="25" rx="4" fill={acLocalMode ? "#047857" : "#064e3b"} stroke="#10b981" strokeWidth="1" />
                <text x="35" y="16" fill="#ffffff" className="text-[7.5px] font-arabic font-black" textAnchor="middle">تحويل LOCAL 🔘</text>
              </g>

              {/* 2. Temperature selectors */}
              <g transform="translate(105, 82)">
                <rect width="70" height="25" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                <text x="35" y="16" fill="#ffffff" className="text-[7.5px] font-arabic font-black" textAnchor="middle">تبريد كامل/نصفي</text>
              </g>
            </g>

            {/* Ventilation flow arrows (مجاري الهواء والتهوية) */}
            <path d="M 50,80 C 20,80 20,110 50,110" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <path d="M 350,80 C 380,80 380,110 350,110" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" fill="none" />
            <text x="35" y="70" fill="#34d399" className="text-[7px] font-arabic font-black" textAnchor="middle">دفق الهواء 💨</text>

            {/* Bottom label */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#022c22/80" stroke="#10b981" strokeWidth="1" />
            <text x="370" y="187" fill="#a7f3d0" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل ❄️: لوحة تشخيص مكيفات القطار الذكية Smart-Line، يتم التحويل لنمط LOCAL لإجبار تشغيل التكييف الساخن/البارد يدوياً.
            </text>
          </svg>
        );

      case 'emergency_brake':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="emBrakeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e0c0c" />
                <stop offset="100%" stopColor="#110606" />
              </linearGradient>
              <filter id="glowRedBig" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="400" height="200" fill="url(#emBrakeGrad)" rx="12" />

            {/* Main red Emergency Brake Mushroom Plunger */}
            <g transform="translate(200, 95)">
              {/* Outer safety base guard */}
              <circle cx="0" cy="0" r="46" fill="#000" stroke="#7f1d1d" strokeWidth="2" />
              <circle cx="0" cy="0" r="38" fill="#ef4444/10" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 3" />
              
              {/* Heavy red mushroom plunger head */}
              <circle cx="0" cy="0" r="28" fill="#b91c1c" stroke="#dc2626" strokeWidth="2" />
              <circle cx="0" cy="0" r="24" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" filter="url(#glowRedBig)" />
              <circle cx="0" cy="0" r="14" fill="#991b1b" />
              
              {/* Rotation arrows showing how to release (Twist to release / لف للتحرير) */}
              <path d="M -16,-16 Q -22,0 -16,16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M -16,16 L -12,11 M -16,16 L -21,12" stroke="#ffffff" strokeWidth="1.5" />

              <path d="M 16,-16 Q 22,0 16,16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 16,-16 L 12,-11 M 16,-16 L 21,-12" stroke="#ffffff" strokeWidth="1.5" />

              <text x="0" y="-35" fill="#fca5a5" className="text-[7.5px] font-black font-arabic" textAnchor="middle">مشروم الطوارئ الفطري</text>
              <text x="0" y="35" fill="#ffffff" className="text-[6.5px] font-black font-arabic" textAnchor="middle">لف للتحرير 🔄</text>
            </g>

            {/* Cab gauges representation */}
            <g transform="translate(45, 60)">
              <rect width="90" height="60" rx="4" fill="#000" stroke="#7f1d1d" strokeWidth="1.5" />
              <text x="45" y="14" fill="#fca5a5" className="text-[7px] font-black font-arabic" textAnchor="middle">ضغط أسطوانة الفرامل BC</text>
              <text x="45" y="32" fill="#ef4444" className="text-[10px] font-mono font-black" textAnchor="middle">3.8 bar 🚨</text>
              <text x="45" y="48" fill="#fca5a5" className="text-[7px] font-arabic font-bold" textAnchor="middle">[فرملة طوارئ كاملة]</text>
            </g>

            <g transform="translate(265, 60)">
              <rect width="90" height="60" rx="4" fill="#000" stroke="#1e293b" strokeWidth="1.5" />
              <text x="45" y="14" fill="#94a3b8" className="text-[7px] font-black font-arabic" textAnchor="middle">زر إعادة تصفير فرملة الطوارئ</text>
              <circle cx="45" cy="35" r="10" fill="#3b82f6" stroke="#ffffff" strokeWidth="1" />
              <text x="45" y="38" fill="#fff" className="text-[6.5px] font-black font-arabic" textAnchor="middle">RESET</text>
            </g>

            {/* Bottom annotation */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#1c1917/80" stroke="#7f1d1d" strokeWidth="1" />
            <text x="370" y="187" fill="#fca5a5" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل 🚨: كبس زر فرملة الطوارئ المشرومي يفرغ أنابيب الهواء تماماً ويفعل الكوابح القصوى. لف الزر لإعادة شحن الأنابيب.
            </text>
          </svg>
        );

      case 'cb_panel':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="400" height="200" fill="url(#panelGrad)" rx="12" />

            {/* 6 Grid items representing circuit breaker toggles */}
            <g transform="translate(15, 20)">
              {/* 1. HMICB */}
              <g transform="translate(10, 10)">
                <rect width="50" height="65" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <text x="25" y="12" fill="#38bdf8" className="text-[7px] font-mono font-black" textAnchor="middle">HMICB</text>
                <circle cx="25" cy="38" r="14" fill="#0f172a" />
                {/* Switch up (ON) */}
                <rect x="22" y="27" width="6" height="15" rx="1.5" fill="#10b981" />
                <text x="25" y="61" fill="#10b981" className="text-[6px] font-black" textAnchor="middle">ON</text>
              </g>

              {/* 2. PanCB */}
              <g transform="translate(70, 10)">
                <rect width="50" height="65" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <text x="25" y="12" fill="#38bdf8" className="text-[7px] font-mono font-black" textAnchor="middle">PanCB</text>
                <circle cx="25" cy="38" r="14" fill="#0f172a" />
                <rect x="22" y="27" width="6" height="15" rx="1.5" fill="#10b981" />
                <text x="25" y="61" fill="#10b981" className="text-[6px] font-black" textAnchor="middle">ON</text>
              </g>

              {/* 3. VCBCB */}
              <g transform="translate(130, 10)">
                <rect width="50" height="65" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <text x="25" y="12" fill="#38bdf8" className="text-[7px] font-mono font-black" textAnchor="middle">VCBCB</text>
                <circle cx="25" cy="38" r="14" fill="#0f172a" />
                <rect x="22" y="27" width="6" height="15" rx="1.5" fill="#10b981" />
                <text x="25" y="61" fill="#10b981" className="text-[6px] font-black" textAnchor="middle">ON</text>
              </g>

              {/* 4. VCUCB */}
              <g transform="translate(190, 10)">
                <rect width="50" height="65" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <text x="25" y="12" fill="#38bdf8" className="text-[7px] font-mono font-black" textAnchor="middle">VCUCB</text>
                <circle cx="25" cy="38" r="14" fill="#0f172a" />
                <rect x="22" y="27" width="6" height="15" rx="1.5" fill="#10b981" />
                <text x="25" y="61" fill="#10b981" className="text-[6px] font-black" textAnchor="middle">ON</text>
              </g>

              {/* 5. HRUCCB */}
              <g transform="translate(250, 10)">
                <rect width="50" height="65" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <text x="25" y="12" fill="#38bdf8" className="text-[7px] font-mono font-black" textAnchor="middle">HRUCCB</text>
                <circle cx="25" cy="38" r="14" fill="#0f172a" />
                <rect x="22" y="27" width="6" height="15" rx="1.5" fill="#10b981" />
                <text x="25" y="61" fill="#10b981" className="text-[6px] font-black" textAnchor="middle">ON</text>
              </g>

              {/* 6. SmokCB */}
              <g transform="translate(310, 10)">
                <rect width="50" height="65" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                <text x="25" y="12" fill="#38bdf8" className="text-[7px] font-mono font-black" textAnchor="middle">SmokCB</text>
                <circle cx="25" cy="38" r="14" fill="#0f172a" />
                <rect x="22" y="27" width="6" height="15" rx="1.5" fill="#10b981" />
                <text x="25" y="61" fill="#10b981" className="text-[6px] font-black" textAnchor="middle">ON</text>
              </g>
            </g>

            {/* Cab Location Arrow */}
            <g transform="translate(20, 110)">
              <rect x="0" y="0" width="360" height="40" rx="6" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              <text x="350" y="24" fill="#fbbf24" className="text-[8.5px] font-arabic font-black" textAnchor="end">🗺️ الموقع بالكابينة:</text>
              <text x="260" y="24" fill="#e2e8f0" className="text-[8px] font-arabic font-bold" textAnchor="end">خلف كرسي قائد القطار بمقصورة الكابينة الرئيسية</text>
              <text x="10" y="25" fill="#38bdf8" className="text-[8px] font-mono font-black" textAnchor="start">MAIN CABINET PANEL [L-01/C-01]</text>
            </g>

            {/* Bottom text */}
            <rect x="10" y="174" width="380" height="22" rx="4" fill="#1e1b4b/60" stroke="#312e81" strokeWidth="1" />
            <text x="370" y="187" fill="#93c5fd" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل 🗺️: لوحة قواطع التيار المتردد والمستمر بالكابينة. تأكد من رفع جميع القواطع للأعلى (وضع ON) لضمان تغذية المكونات.
            </text>
          </svg>
        );

      case 'tcms_traction':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tcmsBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#080c14" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            <rect width="400" height="200" fill="url(#tcmsBg)" rx="10" stroke="#4b5563" strokeWidth="3" />
            <rect x="0" y="0" width="400" height="20" fill="#1f2937" />
            <text x="10" y="13" fill="#9ca3af" className="text-[7px] font-mono">LND mode</text>
            <text x="200" y="13" fill="#ffffff" className="text-[8px] font-mono font-bold" textAnchor="middle">Traction settings</text>
            <text x="390" y="13" fill="#9ca3af" className="text-[7px] font-mono" textAnchor="end">2023-04-10 20:34:53</text>
            <g transform="translate(20, 35)">
              <g transform="translate(10, 20)">
                <rect width="100" height="40" rx="6" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
                <text x="50" y="24" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">Trust network</text>
                <text x="50" y="32" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">direction</text>
              </g>
              <g transform="translate(130, 20)">
                <rect width="100" height="40" rx="6" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
                <text x="50" y="24" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">Overcurrent</text>
                <text x="50" y="32" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">reset</text>
              </g>
              <g transform="translate(250, 20)">
                <rect width="100" height="40" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="50" y="24" fill="#38bdf8" className="text-[6.5px] font-mono font-black" textAnchor="middle">Traction and charger</text>
                <text x="50" y="32" fill="#38bdf8" className="text-[6.5px] font-mono font-black" textAnchor="middle">fault reset</text>
                <rect x="-3" y="-3" width="106" height="46" rx="8" fill="none" stroke="#dc2626" strokeWidth="3" className="animate-pulse" />
              </g>
            </g>
            <rect x="340" y="125" width="40" height="20" rx="3" fill="#1f2937" stroke="#374151" />
            <text x="360" y="137" fill="#ffffff" className="text-[7px] font-mono" textAnchor="middle">Back</text>
            <rect x="0" y="155" width="400" height="25" fill="#111827" />
            <g transform="translate(5, 158)">
              {['Operation', 'Vehicle', 'Comm', 'AC', 'Maint', 'Setting', 'Event', 'Bypass'].map((tab, idx) => {
                const isActive = tab === 'Setting';
                return (
                  <g key={tab} transform={`translate(${idx * 49}, 0)`}>
                    <rect width="46" height="18" rx="2" fill={isActive ? "#059669" : "#1f2937"} stroke={isActive ? "#10b981" : "#374151"} />
                    <text x="23" y="11" fill="#ffffff" className="text-[6px] font-mono font-bold" textAnchor="middle">{tab}</text>
                  </g>
                );
              })}
            </g>
            <rect x="10" y="105" width="220" height="45" rx="4" fill="#0f172a" stroke="#334155" />
            <text x="200" y="118" fill="#fbbf24" className="text-[7.5px] font-arabic font-black" textAnchor="end">شكل 🖥️: قائمة الإعدادات (Setting) على شاشة TCMS</text>
            <text x="200" y="129" fill="#cbd5e1" className="text-[7px] font-arabic font-bold" textAnchor="end">اضغط على زر [Traction and charger fault reset]</text>
            <text x="200" y="139" fill="#cbd5e1" className="text-[7px] font-arabic font-bold" textAnchor="end">الظاهر باللون المظلل باللون الأحمر لإعادة تشغيل الشاحن والجر.</text>
          </svg>
        );

      case 'tcms_overcurrent':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tcmsBg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#080c14" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            <rect width="400" height="200" fill="url(#tcmsBg2)" rx="10" stroke="#4b5563" strokeWidth="3" />
            <rect x="0" y="0" width="400" height="20" fill="#1f2937" />
            <text x="10" y="13" fill="#9ca3af" className="text-[7px] font-mono">LND mode</text>
            <text x="200" y="13" fill="#ffffff" className="text-[8px] font-mono font-bold" textAnchor="middle">Traction settings</text>
            <text x="390" y="13" fill="#9ca3af" className="text-[7px] font-mono" textAnchor="end">2023-04-10 20:34:53</text>
            <g transform="translate(20, 35)">
              <g transform="translate(10, 20)">
                <rect width="100" height="40" rx="6" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
                <text x="50" y="24" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">Trust network</text>
                <text x="50" y="32" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">direction</text>
              </g>
              <g transform="translate(130, 20)">
                <rect width="100" height="40" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="50" y="24" fill="#38bdf8" className="text-[6.5px] font-mono font-black" textAnchor="middle">Overcurrent</text>
                <text x="50" y="32" fill="#38bdf8" className="text-[6.5px] font-mono font-black" textAnchor="middle">reset</text>
                <rect x="-3" y="-3" width="106" height="46" rx="8" fill="none" stroke="#dc2626" strokeWidth="3" className="animate-pulse" />
              </g>
              <g transform="translate(250, 20)">
                <rect width="100" height="40" rx="6" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
                <text x="50" y="24" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">Traction and charger</text>
                <text x="50" y="32" fill="#ffffff" className="text-[6.5px] font-mono font-bold" textAnchor="middle">fault reset</text>
              </g>
            </g>
            <rect x="340" y="125" width="40" height="20" rx="3" fill="#1f2937" stroke="#374151" />
            <text x="360" y="137" fill="#ffffff" className="text-[7px] font-mono" textAnchor="middle">Back</text>
            <rect x="0" y="155" width="400" height="25" fill="#111827" />
            <g transform="translate(5, 158)">
              {['Operation', 'Vehicle', 'Comm', 'AC', 'Maint', 'Setting', 'Event', 'Bypass'].map((tab, idx) => {
                const isActive = tab === 'Setting';
                return (
                  <g key={tab} transform={`translate(${idx * 49}, 0)`}>
                    <rect width="46" height="18" rx="2" fill={isActive ? "#059669" : "#1f2937"} stroke={isActive ? "#10b981" : "#374151"} />
                    <text x="23" y="11" fill="#ffffff" className="text-[6px] font-mono font-bold" textAnchor="middle">{tab}</text>
                  </g>
                );
              })}
            </g>
            <rect x="10" y="105" width="220" height="45" rx="4" fill="#0f172a" stroke="#334155" />
            <text x="200" y="118" fill="#fbbf24" className="text-[7.5px] font-arabic font-black" textAnchor="end">شكل 🖥️: قائمة الإعدادات (Setting) على شاشة TCMS</text>
            <text x="200" y="129" fill="#cbd5e1" className="text-[7px] font-arabic font-bold" textAnchor="end">اضغط على زر [Overcurrent reset] لتصفير ريلاي التيار الزائد</text>
            <text x="200" y="139" fill="#cbd5e1" className="text-[7px] font-arabic font-bold" textAnchor="end">الظاهر باللون المظلل باللون الأحمر لإعادة تشغيل الـ VCB.</text>
          </svg>
        );

      case 'tcms_equipment':
        return (
          <svg viewBox="0 0 400 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tcmsBg3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#080c14" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            <rect width="400" height="200" fill="url(#tcmsBg3)" rx="10" stroke="#4b5563" strokeWidth="3" />
            <rect x="0" y="0" width="400" height="20" fill="#1f2937" />
            <text x="10" y="13" fill="#9ca3af" className="text-[7px] font-mono">LND mode</text>
            <text x="200" y="13" fill="#ffffff" className="text-[8px] font-mono font-bold" textAnchor="middle">Equipment cut-off</text>
            <text x="390" y="13" fill="#9ca3af" className="text-[7px] font-mono" textAnchor="end">2023-04-10 20:31:36</text>
            <g transform="translate(10, 25)">
              <g transform="translate(0, 5)">
                <text x="5" y="12" fill="#e2e8f0" className="text-[6.5px] font-mono font-bold">Pantograph of car 2</text>
                <rect x="105" y="2" width="34" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono font-bold" textAnchor="middle">Cut off</text>
                <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono font-bold" textAnchor="middle">Reset</text>
              </g>
              <g transform="translate(0, 23)">
                <text x="5" y="12" fill="#e2e8f0" className="text-[6.5px] font-mono font-bold">Pantograph of car 5</text>
                <rect x="105" y="2" width="34" height="14" rx="2" fill="#1e293b" stroke="#dc2626" strokeWidth="1.5" />
                <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono font-black" textAnchor="middle">Cut off</text>
                <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono font-bold" textAnchor="middle">Reset</text>
                <rect x="103" y="0" width="38" height="18" rx="3" fill="none" stroke="#dc2626" strokeWidth="2" className="animate-pulse" />
              </g>
              <g transform="translate(0, 41)">
                <text x="5" y="12" fill="#e2e8f0" className="text-[6.5px] font-mono font-bold">air compressor of car 1</text>
                <rect x="105" y="2" width="34" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono" textAnchor="middle">Cut off</text>
                <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono" textAnchor="middle">Reset</text>
              </g>
              <g transform="translate(0, 59)">
                <text x="5" y="12" fill="#e2e8f0" className="text-[6.5px] font-mono font-bold">air compressor of car 6</text>
                <rect x="105" y="2" width="34" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono" textAnchor="middle">Cut off</text>
                <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono" textAnchor="middle">Reset</text>
              </g>
              <g transform="translate(185, 0)">
                <g transform="translate(0, 5)">
                  <text x="5" y="12" fill="#e2e8f0" className="text-[6px] font-mono font-bold">Main CB of car 2</text>
                  <rect x="105" y="2" width="34" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono" textAnchor="middle">Cut off</text>
                  <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono" textAnchor="middle">Reset</text>
                </g>
                <g transform="translate(0, 23)">
                  <text x="5" y="12" fill="#e2e8f0" className="text-[6px] font-mono font-bold">Main CB of car 5</text>
                  <rect x="105" y="2" width="34" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono" textAnchor="middle">Cut off</text>
                  <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono" textAnchor="middle">Reset</text>
                </g>
                <g transform="translate(0, 41)">
                  <text x="5" y="12" fill="#e2e8f0" className="text-[6px] font-mono font-bold">Auxiliary contactor</text>
                  <rect x="105" y="2" width="34" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono" textAnchor="middle">Cut off</text>
                  <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono" textAnchor="middle">Reset</text>
                </g>
                <g transform="translate(0, 59)">
                  <text x="5" y="12" fill="#e2e8f0" className="text-[6px] font-mono font-bold">High speed disconnector</text>
                  <rect x="105" y="2" width="34" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="122" y="11" fill="#ef4444" className="text-[6px] font-mono" textAnchor="middle">Cut off</text>
                  <rect x="144" y="2" width="30" height="14" rx="2" fill="#1f2937" stroke="#374151" />
                  <text x="159" y="11" fill="#38bdf8" className="text-[6px] font-mono" textAnchor="middle">Reset</text>
                </g>
              </g>
            </g>
            <rect x="340" y="105" width="40" height="16" rx="3" fill="#1f2937" stroke="#374151" />
            <text x="360" y="116" fill="#ffffff" className="text-[7px] font-mono" textAnchor="middle">Back</text>
            <path d="M 60,113 L 115,55" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="10" y="102" width="80" height="22" rx="3" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="1" />
            <text x="50" y="116" fill="#fbbf24" className="text-[7.5px] font-arabic font-black" textAnchor="middle">عزل البانتوجراف 👈</text>
            <rect x="0" y="155" width="400" height="25" fill="#111827" />
            <g transform="translate(5, 158)">
              {['Operation', 'Vehicle', 'Comm', 'AC', 'Maint', 'Setting', 'Event', 'Bypass'].map((tab, idx) => {
                const isActive = tab === 'Setting';
                return (
                  <g key={tab} transform={`translate(${idx * 49}, 0)`}>
                    <rect width="46" height="18" rx="2" fill={isActive ? "#059669" : "#1f2937"} stroke={isActive ? "#10b981" : "#374151"} />
                    <text x="23" y="11" fill="#ffffff" className="text-[6px] font-mono font-bold" textAnchor="middle">{tab}</text>
                  </g>
                );
              })}
            </g>
            <rect x="95" y="127" width="295" height="24" rx="4" fill="#0f172a" stroke="#334155" />
            <text x="380" y="141" fill="#cbd5e1" className="text-[7px] font-arabic font-black" textAnchor="end">
              شكل 🖥️: شاشة عزل واستعادة المعدات (Equipment Cut-off). اضغط على زر [Cut off] للمنساخ أو الكباس لعزله عن القطار.
            </text>
          </svg>
        );

      case 'console':
      default:
        {
          const isHighlighted = (btnName: string) => {
            return fault.breakers.some(b => b.toUpperCase() === btnName.toUpperCase());
          };

          const buttons = [
            { id: 1, name: 'BRAKE RELEASE', labelAr: 'تصريف الفرامل', color: '#10b981', textColor: '#ffffff', row: 0, x: 25 },
            { id: 2, name: 'PARKING BRAKE RELEASE', labelAr: 'تصريف رباط الانتظار', color: '#fbbf24', textColor: '#000000', row: 0, x: 75 },
            { id: 3, name: 'DOOR CLOSE', labelAr: 'غلق الأبواب', color: '#ffffff', textColor: '#000000', row: 0, x: 125 },
            { id: 4, name: 'PB RELEASE IND', labelAr: 'مؤشر رباط الانتظار', color: '#ef4444', textColor: '#ffffff', row: 0, x: 175, isIndicator: true },
            { id: 5, name: 'VCB CLOSE', labelAr: 'غلق VCB', color: '#10b981', textColor: '#ffffff', row: 0, x: 225, hasRing: true },
            { id: 6, name: 'VCB OPEN', labelAr: 'فتح VCB', color: '#ef4444', textColor: '#ffffff', row: 0, x: 275, hasRing: true },
            { id: 7, name: 'ATB', labelAr: 'مفتاح ATB', color: '#fbbf24', textColor: '#000000', row: 0, x: 325 },
            { id: 8, name: 'PARKING BRAKE APPLY', labelAr: 'تفعيل رباط الانتظار', color: '#ef4444', textColor: '#ffffff', row: 0, x: 375 },
            { id: 9, name: 'PANTO DOWN', labelAr: 'خفض البانتوجراف', color: '#ef4444', textColor: '#ffffff', row: 1, x: 45 },
            { id: 10, name: 'PANTO UP', labelAr: 'رفع البانتوجراف', color: '#10b981', textColor: '#ffffff', row: 1, x: 105, hasRing: true },
            { id: 11, name: 'UNCOUPLING', labelAr: 'فك التقاطر', color: '#10b981', textColor: '#ffffff', row: 1, x: 165 },
            { id: 12, name: 'BATTERY CUTOFF', labelAr: 'عزل البطاريات', color: '#ef4444', textColor: '#ffffff', row: 1, x: 225 },
            { id: 13, name: 'BATTERY ACTIVE', labelAr: 'تفعيل البطاريات', color: '#10b981', textColor: '#ffffff', row: 1, x: 285, hasRing: true },
            { id: 14, name: 'HEAD LIGHT', labelAr: 'إنارة القطار', color: '#10b981', textColor: '#ffffff', row: 1, x: 345 }
          ];

          return (
            <svg viewBox="0 0 410 200" className="w-full h-full max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="410" height="200" fill="#0c0a09" rx="10" stroke="#44403c" strokeWidth="2.5" />
              <rect x="5" y="5" width="400" height="190" fill="#1c1917" rx="6" stroke="#292524" />
              <text x="205" y="16" fill="#78716c" className="text-[7px] font-black font-arabic" textAnchor="middle">
                شكل 1: لوحة التحكم الوسطى بالكونسول الرئيسي (MIDDLE CONTROL PANEL CONSOLE)
              </text>
              {buttons.map(btn => {
                const active = isHighlighted(btn.name) || isHighlighted(btn.labelAr);
                const y = btn.row === 0 ? 50 : 125;
                const r = btn.isIndicator ? 8 : 11;
                return (
                  <g key={btn.id} transform={`translate(${btn.x}, ${y})`}>
                    {active && (
                      <circle cx="0" cy="0" r={r + 8} fill="none" stroke="#fbbf24" strokeWidth="2.5" className="animate-pulse" />
                    )}
                    {btn.hasRing && (
                      <circle cx="0" cy="0" r={r + 4} fill="none" stroke={active ? "#34d399" : "#44403c"} strokeWidth="1.5" />
                    )}
                    <circle cx="0" cy="0" r={r} fill="#1c1917" stroke="#44403c" strokeWidth="1" />
                    <circle cx="0" cy="0" r={r - 2} fill={btn.color} stroke="#000000" strokeWidth="0.5" />
                    {active && (
                      <circle cx="0" cy="0" r={r - 4} fill="#ffffff" opacity="0.4" />
                    )}
                    <text x="0" y={btn.row === 0 ? -18 : 22} fill={active ? "#fbbf24" : "#a8a29e"} className={`text-[4.5px] font-black font-arabic ${active ? "font-bold text-amber-500 scale-105" : ""}`} textAnchor="middle">
                      {btn.labelAr}
                    </text>
                    <text x="0" y={btn.row === 0 ? -24 : 28} fill={active ? "#fbbf24" : "#57534e"} className="text-[3.5px] font-mono font-bold" textAnchor="middle">
                      {btn.name}
                    </text>
                  </g>
                );
              })}
              <rect x="10" y="168" width="390" height="24" rx="4" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
              <text x="395" y="181" fill="#cbd5e1" className="text-[7.2px] font-arabic font-black" textAnchor="end">
                {fault.id === 1 ? '👉 اضغط مع الاستمرار على [BATTERY CUTOFF] لعزل البطارية، ثم انتظر 30 ثانية واضغط على [BATTERY ACTIVE].' :
                 fault.id === 11 ? '👉 تأكد من وضع مفتاح [ETM] في لوحة التحكم وتفعيل [PANTO UP] و [VCB CLOSE] للتغذية المباشرة.' :
                 fault.id === 14 ? '👉 يتم رفع البانتوجراف بالضغط على [PANTO UP] لمدة 3 ثوان متواصلة وتأكيد تفعيل البطاريات.' :
                 '👉 تظهر الأزرار المظللة باللون الأصفر/الأحمر لتوضيح الأماكن الواجب استخدامها طبقاً لدليل التعامل المعتمد.'}
              </text>
            </svg>
          );
        }
    }
  };

  return (
    <div className="bg-slate-950 rounded-xl p-4 min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden border border-slate-800" id={`fault-diagram-canvas-${fault.id}`}>
      {/* Decorative grid pattern backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-25" />
      
      {/* Schematic drawing */}
      <div className="w-full flex justify-center items-center relative z-10">
        {renderSvgContent()}
      </div>
    </div>
  );
}
