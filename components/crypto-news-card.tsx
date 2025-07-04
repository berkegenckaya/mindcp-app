import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface CryptoNewsArticle {
  id: number
  title: string
  url: string
  source: string
  published_at: string
  hot: boolean
  currencies: string[]
  votes: {
    positive: number
    negative: number
    important: number
    liked: number
    disliked: number
    comments: number
  }
}

interface CryptoNewsData {
  count: number
  articles: CryptoNewsArticle[]
  sentiment?: string
  symbol?: string
}

interface CryptoNewsCardProps {
  newsData: CryptoNewsData
}

export function CryptoNewsCard({ newsData }: CryptoNewsCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "bullish": return "text-green-400 bg-green-500/20 border-green-500/30"
      case "bearish": return "text-red-400 bg-red-500/20 border-red-500/30"
      default: return "text-blue-400 bg-blue-500/20 border-blue-500/30"
    }
  }

  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-white/8 via-white/5 to-white/3 backdrop-blur-md border border-white/10 text-white w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">
            {newsData.symbol ? `${newsData.symbol} News` : "Crypto News"}
          </h3>
          {newsData.sentiment && (
            <Badge className={`${getSentimentColor(newsData.sentiment)} border backdrop-blur-md`}>
              {/* Removed getSentimentIcon(newsData.sentiment) */}
              <span className="ml-1 capitalize">{newsData.sentiment}</span>
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="text-white/70 border-white/20">
          {newsData.count} articles
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {newsData.articles.slice(0, 10).map((article) => (
          <div
            key={article.id}
            className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/8 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {article.source}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.published_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                
                {/* Show description if available */}
                {(article as any).description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {(article as any).description}
                  </p>
                )}

                {/* Currencies */}
                {article.currencies && article.currencies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.currencies.map((currency) => (
                      <Badge key={currency} variant="secondary" className="text-xs">
                        {currency}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Votes and stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    {article.votes.positive > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="text-green-500">↑</span>
                        {article.votes.positive}
                      </span>
                    )}
                    {article.votes.negative > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="text-red-500">↓</span>
                        {article.votes.negative}
                      </span>
                    )}
                    {article.votes.comments > 0 && (
                      <span className="flex items-center gap-1">
                        💬 {article.votes.comments}
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="ml-2"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {newsData.articles.length > 10 && (
        <div className="mt-3 text-center">
          <Badge variant="outline" className="text-white/60 border-white/20">
            Showing 10 of {newsData.articles.length} articles
          </Badge>
        </div>
      )}
    </div>
  )
} 