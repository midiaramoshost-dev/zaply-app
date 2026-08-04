import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TextFinder() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ text: string; tag: string; element: HTMLElement }[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const search = () => {
    if (!query.trim()) return;
    
    const found: { text: string; tag: string; element: HTMLElement }[] = [];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    
    while ((node = walk.nextNode())) {
      if (node.textContent?.toLowerCase().includes(query.toLowerCase())) {
        const parent = node.parentElement;
        if (parent && parent.tagName !== "SCRIPT" && parent.tagName !== "STYLE") {
          found.push({
            text: node.textContent.trim(),
            tag: parent.tagName.toLowerCase(),
            element: parent
          });
        }
      }
    }
    setResults(found);
  };

  const highlight = (el: HTMLElement) => {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const originalBackground = el.style.backgroundColor;
    const originalTransition = el.style.transition;
    
    el.style.transition = "background-color 0.3s";
    el.style.backgroundColor = "rgba(59, 130, 246, 0.5)";
    
    setTimeout(() => {
      el.style.backgroundColor = originalBackground;
      el.style.transition = originalTransition;
    }, 2000);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-20 right-4 z-[100] rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/50"
        onClick={() => setIsOpen(true)}
        title="Localizador de Texto (Ctrl+F)"
      >
        <Search className="size-4 text-primary" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-[100] w-80 rounded-xl border border-border bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Localizador de Texto</h3>
        <Button variant="ghost" size="icon" className="size-6" onClick={() => setIsOpen(false)}>
          <X className="size-3" />
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Texto para buscar..."
          className="h-8 text-xs"
        />
        <Button size="sm" className="h-8 px-3 text-xs" onClick={search}>
          Buscar
        </Button>
      </div>

      <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-1">
        {results.length > 0 ? (
          results.map((res, i) => (
            <button
              key={i}
              onClick={() => highlight(res.element)}
              className="w-full text-left p-2 rounded-md hover:bg-accent/50 transition-colors border border-transparent hover:border-border group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-primary uppercase">{res.tag}</span>
                <Search className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 italic italic">"{res.text}"</p>
            </button>
          ))
        ) : (
          <p className="text-center py-4 text-xs text-muted-foreground italic">
            {query ? "Nenhum resultado encontrado." : "Digite algo para buscar no site."}
          </p>
        )}
      </div>
    </div>
  );
}
