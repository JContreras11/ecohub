"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useBalance } from "wagmi";
import { metaMask, walletConnect } from "wagmi/connectors";
import { useState, useEffect } from "react";
import { Wallet, ChevronDown, LogOut, Copy, Check, Zap } from "lucide-react";
import { toast } from "sonner";

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getChainName(chainId: number): string {
  const names: Record<number, string> = {
    1:        "Ethereum",
    137:      "Polygon",
    11155111: "Sepolia",
    80002:    "Amoy",
    31337:    "Localhost",
  };
  return names[chainId] || `Chain ${chainId}`;
}

function ConnectWalletInner() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });

  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    setShowMenu(false);
    toast.info("Wallet disconnected");
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          id="wallet-menu-button"
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-verdant-500/30
                     bg-verdant-900/50 backdrop-blur-md text-verdant-300 hover:text-verdant-100
                     hover:border-verdant-400/50 hover:bg-verdant-800/60
                     transition-all duration-200 group shadow-card"
        >
          {/* Status indicator */}
          <span className="w-2 h-2 rounded-full bg-verdant-400 animate-glow-pulse" />
          <span className="text-sm font-mono font-medium">
            {shortenAddress(address)}
          </span>
          {/* Chain badge */}
          <span className="hidden sm:flex items-center gap-1 text-xs px-2 py-0.5
                           bg-verdant-700/50 rounded-full text-verdant-300 border border-verdant-600/30">
            <Zap className="w-2.5 h-2.5" />
            {getChainName(chainId)}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-verdant-400 transition-transform duration-200
                        ${showMenu ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 mt-2 w-72 z-50 animate-slide-up
                            bg-earth-800/95 backdrop-blur-xl
                            border border-verdant-500/20 rounded-2xl shadow-card overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-verdant-700/30">
                <p className="text-xs text-verdant-500 mb-1">Connected Wallet</p>
                <p className="font-mono text-sm text-verdant-200 break-all">{address}</p>
                {balance && (
                  <p className="text-xs text-verdant-400 mt-1">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  id="copy-address-button"
                  onClick={copyAddress}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                             text-verdant-300 hover:text-verdant-100 hover:bg-verdant-700/30
                             transition-all duration-150 text-sm"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-verdant-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy Address"}
                </button>

                <button
                  id="disconnect-button"
                  onClick={handleDisconnect}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                             text-red-400 hover:text-red-300 hover:bg-red-500/10
                             transition-all duration-150 text-sm mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        id="connect-wallet-button"
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-sm
                   bg-gradient-to-r from-verdant-600 to-verdant-500
                   text-white hover:from-verdant-500 hover:to-verdant-400
                   shadow-glow-verdant hover:shadow-lg
                   transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                   border border-verdant-400/20 group"
      >
        <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
        {isPending ? "Connecting…" : "Connect Wallet"}
      </button>

      {/* Connector selection dropdown */}
      {showConnectors && !isPending && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowConnectors(false)}
          />
          <div className="absolute right-0 mt-2 w-64 z-50 animate-slide-up
                          bg-earth-800/95 backdrop-blur-xl
                          border border-verdant-500/20 rounded-2xl shadow-card overflow-hidden">
            <div className="p-3 border-b border-verdant-700/30">
              <p className="text-xs text-verdant-500 text-center">Choose a wallet</p>
            </div>
            <div className="p-2 space-y-1">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  id={`connector-${connector.id}`}
                  onClick={() => {
                    connect({ connector });
                    setShowConnectors(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-3 rounded-xl
                             text-verdant-200 hover:text-white hover:bg-verdant-700/40
                             transition-all duration-150 text-sm font-medium"
                >
                  <div className="w-8 h-8 rounded-lg bg-verdant-800 border border-verdant-600/30
                                  flex items-center justify-center text-lg">
                    {connector.name.includes("MetaMask") ? "🦊" :
                     connector.name.includes("WalletConnect") ? "🔗" : "💼"}
                  </div>
                  {connector.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ConnectWalletButton() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-36 bg-verdant-900/20 rounded-2xl border border-verdant-500/20 animate-pulse" />
    );
  }

  return <ConnectWalletInner />;
}

