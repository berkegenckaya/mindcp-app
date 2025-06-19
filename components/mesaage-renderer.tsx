import { User } from "lucide-react";
import type { Message } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { TokenInfoCard } from "./token-info-card";
import { TrendingPoolsCard } from "./trending-pools-card";
import Image from "next/image";


interface ChatMessageProps {
  message: Message;
}

interface Pool {
  protocolName: string
  poolName: string
  poolAPY: number
  poolTVL: number
  poolTokenAddress: string
  poolExposure: string
  poolAPYMean30d: number
  poolILRisk: string
}
interface UniswapPool {
  pair: string
  fee: string
  tvlUsd: number
  estimatedApr: number
  address: string
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isProcessingTool =
    message.role === "assistant" &&
    message.parts?.some((part) => part.type === "tool-invocation") &&
    message.content === "";

    const toolComponents = message.parts?.map((part, partIndex) => {

      if (part.type !== "tool-invocation") return null
      // if ('result' in part.toolInvocation && part.toolInvocation.result) {
      // }
      switch (part.toolInvocation.toolName) {
        case "filterEthPoolsSortbyTVL":
          const poolData = 'result' in part.toolInvocation && part.toolInvocation.result?.data ? part.toolInvocation.result.data : [];
        const mappedData = (poolData as Pool[]).map((pool) => ({
          protocolName: pool.protocolName,
          poolName: pool.poolName,
          poolAPY: pool.poolAPY,
          poolTVL: pool.poolTVL,
          poolTokenAddress: [pool.poolTokenAddress], // Convert to an array of strings
          poolExposure: pool.poolExposure,
          poolAPYMean30d: pool.poolAPYMean30d,
          poolILRisk: pool.poolILRisk
        }));

        const userQuery = message.content?.toLowerCase() || ""
        let assetType = "USDT" // Default

        // Check for common asset types in the query
        if (userQuery.includes("eth") || userQuery.includes("ethereum")) {
          assetType = "ETH"
        } else if (userQuery.includes("btc") || userQuery.includes("bitcoin")) {
          assetType = "BTC"
        } else if (userQuery.includes("usdc")) {
          assetType = "USDC"
        } else if (userQuery.includes("dai")) {
          assetType = "DAI"
        }

        return <YieldOptionsDisplay key={partIndex} options={mappedData} assetType={assetType} />
        case "filterEthPoolsSortbyAPY":
          const poolDataAPY = 'result' in part.toolInvocation && part.toolInvocation.result?.data ? part.toolInvocation.result.data : [];
          const mappedDataAPY = (poolDataAPY as Pool[]).map((pool) => ({
            protocolName: pool.protocolName,
            poolName: pool.poolName,
            poolAPY: pool.poolAPY,
            poolTVL: pool.poolTVL,
            poolTokenAddress: [pool.poolTokenAddress],
            poolExposure: pool.poolExposure,
            poolAPYMean30d: pool.poolAPYMean30d,
            poolILRisk: pool.poolILRisk
          }));

          const userQueryAPY = message.content?.toLowerCase() || ""
          let assetTypeAPY = "USDT" // Default

          // Check for common asset types in the query
          if (userQueryAPY.includes("eth") || userQueryAPY.includes("ethereum")) {
            assetTypeAPY = "ETH"
          } else if (userQueryAPY.includes("btc") || userQueryAPY.includes("bitcoin")) {
            assetTypeAPY = "BTC"
          } else if (userQueryAPY.includes("usdc")) {
            assetTypeAPY = "USDC"
          } else if (userQueryAPY.includes("dai")) {
            assetTypeAPY = "DAI"
          }

          return <YieldOptionsDisplay key={partIndex} options={mappedDataAPY} assetType={assetTypeAPY} />
        case "get_uniswap_pools_sort_TVL":
          const uniswapPoolData =
            "result" in part.toolInvocation && part.toolInvocation.result?.data ? part.toolInvocation.result.data : []
  
          // Make sure the data is in the correct format for UniswapPoolsDisplay
          if (Array.isArray(uniswapPoolData) && uniswapPoolData.length > 0) {
            return <UniswapPoolsDisplay key={partIndex} data={uniswapPoolData as UniswapPool[]} />
          }
          return null
  
        case "get_uniswap_pools_sort_APY":
          const uniswapPoolDataAPY =
            "result" in part.toolInvocation && part.toolInvocation.result?.data ? part.toolInvocation.result.data : []
  
          // Make sure the data is in the correct format for UniswapPoolsDisplay
          if (Array.isArray(uniswapPoolDataAPY) && uniswapPoolDataAPY.length > 0) {
            return <UniswapPoolsDisplay key={partIndex} data={uniswapPoolDataAPY as UniswapPool[]} />
          }
          return null
  
      default:
        return null
      }
    })

    return (
      <div className={cn("flex items-start gap-2 ", isUser ? "justify-end" : "justify-start")}>
        {!isUser && (
          <div className="flex h-8 w-8 shrink-0 bg-black select-none items-center justify-center rounded-md ">
          <Image src="/logomin.svg" alt="" width={24} height={24}></Image>
         </div>
        )}
        <div className="flex flex-col  justify-center gap-3 max-w-[90%]">
          {toolComponents?.some((component) => component !== null) && (
           <div className="flex flex-col gap-3">
            {toolComponents}
          </div>
          )}
          <div className={cn("rounded-lg px-4 py-4", isUser ? "bg-[#FFFFFF1A] text-white" : "bg-none")}>
          {isProcessingTool ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
                <span className="text-sm">Processing request</span>
              </div>
            ) : (
              <ReactMarkdown 
                components={{
                  p({ children }) {
                    return <p className="mb-2  last:mb-0 leading-relaxed">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>
                  },
                  li({ children }) {
                    return toolComponents?.some(component => component !== null) ? null : <li className="leading-relaxed">{children}</li>                  },
                  h1({ children }) {
                    return <h1 className="text-xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h3>
                  },
                  blockquote({ children }) {
                    return <blockquote className="border-l-2 border-primary pl-4 italic my-2">{children}</blockquote>
                  },
                  a({ children, href }) {
                    return (
                      <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    )
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-border">{children}</table>
                      </div>
                    )
                  },
                  th({ children }) {
                    return <th className="px-4 py-2  font-medium bg-muted">{children}</th>
                  },
                  td({ children }) {
                    return <td className="px-4 py-2 border-t border-border">{children}</td>
                  },
                }}
              >
                
                {message.content}
              </ReactMarkdown>
               
            ) }
            
          </div>
        </div>
        {isUser && (
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    );
}
