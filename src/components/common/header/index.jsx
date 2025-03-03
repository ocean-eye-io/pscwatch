'use client';

import { useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { AlertsPanel } from './alerts-panel';
import Image from 'next/image';
import Link from 'next/link';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  const [showAlerts, setShowAlerts] = useState(false);
  
  const navIcons = [
    { src: '/icons/1.svg', active: false },
    //{ src: '/icons/2.svg', active: false },
    //{ src: '/icons/3.svg', active: false },
    { src: '/icons/4.svg', active: false },
    //{ src: '/icons/5.svg', active: true }, 
  ];

  return (
    <div className="w-full font-nunito">
      {/* First Row - Main Navigation */}
      <div className="bg-[#132337] border-b border-[#1E3654]">
        <div className="flex items-center justify-between px-4 h-14 max-w-[1920px] mx-auto">
          {/* Left section with logo */}
          <div className="flex items-center gap-2">
            <Image 
              src="/icons/Ocean Eye.svg"
              alt="Ocean Eye Logo"
              width={96}
              height={96}
              className="w-31 h-31"
              priority
            />
          </div>

          {/* Center section with navigation icons */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8">
            {navIcons.map((icon, index) => (
              <button
                key={index}
                className={`p-2 rounded-full transition-colors hover:bg-[#1E3654] ${
                  icon.active ? 'bg-[#1E3654]' : ''
                }`}
              >
                <Image 
                  src={icon.src}
                  alt={`Navigation Icon ${index + 1}`}
                  width={24}
                  height={24}
                  className={`w-6 h-6 ${icon.active ? 'brightness-125' : ''}`}
                  priority
                />
              </button>
            ))}
          </div>

          {/* Right section with notifications and profile */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-[#1E3654] rounded-full transition-colors relative"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <Bell className="w-5 h-5 text-[#f4f4f4]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[#f4f4f4] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                4
              </span>
            </button>

            <button className="p-2 hover:bg-[#1E3654] rounded-full transition-colors">
              <Image 
                src="/icons/9dots.svg"
                alt="Menu"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </button>

            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-[#f4f4f4] text-sm">UA</span>
            </div>
          </div>

          {showAlerts && (
            <AlertsPanel onClose={() => setShowAlerts(false)} />
          )}
        </div>
      </div>

      {/* Second Row - Breadcrumb and Voyage Status */}
      <div className="border-b border-[#1E3654]">
        <div className="flex items-center justify-between px-4 h-12 max-w-[1920px] mx-auto">
          {/* Left - Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#f4f4f4]">Performance</span>
            <ChevronRight className="w-4 h-4 text-[#f4f4f4]" />
            <Link href="/fleet">
              <span className="text-[#f4f4f4] hover:text-blue-400 cursor-pointer transition-colors">
                Fuel Monitoring Dashboard
              </span>
            </Link>
            <ChevronRight className="w-4 h-4 text-[#f4f4f4]" />
            <span className="text-blue-400">RTM Cabot</span>
          </div>

          {/* Right - Voyage Status with Enhanced Tooltip */}
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer group hover:bg-[#1E3654]/30 px-3 py-1 rounded-md transition-all">
                  <span className="text-[#f4f4f4] text-sm font-bold">VOYAGE</span>
                  <div className="bg-[#1E3654] text-blue-400 px-3 py-1 rounded text-sm font-semibold">
                    IN PROGRESS
                  </div>
                  <span className="text-[#f4f4f4] text-sm font-semibold group-hover:text-blue-400 transition-colors">
                    KLAIPEDA - SAN JUAN
                  </span>
                  <span className="text-[#f4f4f4] text-sm">2025-01-29 19:30</span>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="w-96"
                sideOffset={5}
              >
                <div className="p-4">
                  <div className="mb-4 border-b border-[#1E3654] pb-2">
                    <h3 className="text-[#f4f4f4] font-bold text-sm">Voyage Information</h3>
                    <p className="text-[#38BDF8] text-xs">KLAIPEDA - SAN JUAN</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">CP Speed</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[#f4f4f4] font-semibold text-sm">
                            12.5 <span className="text-[#f4f4f4]/60">knots</span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">Current Speed</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[#f4f4f4] font-semibold text-sm">
                            11.8 <span className="text-[#f4f4f4]/60">knots</span>
                          </p>
                          <span className="text-red-400 text-xs">▼ 5%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">Avg. Speed</p>
                        <p className="text-[#f4f4f4] font-semibold text-sm">
                          11.5 <span className="text-[#f4f4f4]/60">knots</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">CP Consumption</p>
                        <p className="text-[#f4f4f4] font-semibold text-sm">
                          26.0 <span className="text-[#f4f4f4]/60">MT/day</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">Current Consumption</p>
                        <p className="text-[#f4f4f4] font-semibold text-sm">
                          25.2 <span className="text-[#f4f4f4]/60">MT/day</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">Avg. Consumption</p>
                        <p className="text-[#f4f4f4] font-semibold text-sm">
                          25.5 <span className="text-[#f4f4f4]/60">MT/day</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E3654]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">ETA</p>
                        <p className="text-[#f4f4f4] font-semibold text-sm">2025-02-15 08:30</p>
                      </div>
                      <div>
                        <p className="text-[#f4f4f4]/60 text-xs mb-1">Distance Remaining</p>
                        <p className="text-[#f4f4f4] font-semibold text-sm">1,245 NM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}