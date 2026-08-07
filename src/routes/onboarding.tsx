import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Building2, Layout, CreditCard, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { setupInitialTenant } from "@/lib/onboarding.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const PLANS = [
  { id: "starter", name: "Starter", price: "R$ 97", features: ["1 Marca", "30 Posts/mês", "IA Zaply Basic"] },
  { id: "pro", name: "Pro", price: "R$ 197", features: ["5 Marcas", "Posts Ilimitados", "IA Zaply Premium", "White Label"] },
  { id: "agency", name: "Agency", price: "R$ 497", features: ["Marcas Ilimitadas", "Multi-usuários", "API n8n Dedicada", "Suporte VIP"] },
];

function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);

  // Form state
  const [tenantName, setTenantName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [planId, setPlanId] = useState("pro");

  if (authLoading) return <div className="grid h-screen place-items-center"><Loader2 className="animate-spin" /></div>;
  if (!user) {
    navigate({ to: "/auth", search: { next: "/onboarding" } });
    return null;
  }

  const handleFinish = async () => {
    setBusy(true);
    try {
      await setupInitialTenant({ data: {
        tenantName,
        orgName,
        planId,
        userId: user.id,
        userEmail: user.email! }
      });
      toast.success("Configuração concluída com sucesso!");
      navigate({ to: "/painel" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao configurar conta");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center">
              <div className={`grid size-8 place-items-center rounded-full text-xs font-bold transition-colors ${step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                {step > s ? <CheckCircle2 className="size-4" /> : s}
              </div>
              {s < 3 && <div className={`h-px flex-1 mx-2 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <Card className="panel border-border/70 bg-surface/70 backdrop-blur">
          {step === 1 && (
            <>
              <CardHeader>
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Building2 className="size-6" />
                </div>
                <CardTitle className="text-2xl">Vamos começar pela sua Agência</CardTitle>
                <CardDescription>Defina o nome da sua operação White Label no Zaply.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Agência / Tenant</Label>
                  <Input 
                    placeholder="Ex: Minha Agência Digital" 
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground italic">Este será o nome que seus clientes verão na plataforma.</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={tenantName.length < 3}
                  onClick={() => setStep(2)}
                >
                  Próximo Passo
                </Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-blue-400/15 text-blue-400">
                  <Layout className="size-6" />
                </div>
                <CardTitle className="text-2xl">Sua primeira Organização</CardTitle>
                <CardDescription>Organizações são onde você agrupa as marcas ou clientes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da Organização Inicial</Label>
                  <Input 
                    placeholder="Ex: Time de Operações" 
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Voltar</Button>
                <Button 
                  className="flex-[2]" 
                  disabled={orgName.length < 3}
                  onClick={() => setStep(3)}
                >
                  Escolher Plano
                </Button>
              </CardFooter>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-amber-400/15 text-amber-400">
                  <CreditCard className="size-6" />
                </div>
                <CardTitle className="text-2xl">Escolha seu Plano</CardTitle>
                <CardDescription>Selecione o plano que melhor atende sua estrutura atual.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {PLANS.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => setPlanId(p.id)}
                      className={`relative cursor-pointer rounded-xl border p-4 transition-all ${planId === p.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border/50 hover:border-primary/50"}`}
                    >
                      {planId === p.id && <div className="absolute -right-2 -top-2 rounded-full bg-primary p-1 text-white shadow-lg"><CheckCircle2 className="size-3" /></div>}
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{p.name}</p>
                      <p className="mt-1 text-xl font-bold">{p.price}<span className="text-[10px] text-muted-foreground font-normal">/mês</span></p>
                      <ul className="mt-4 space-y-2">
                        {p.features.slice(0, 3).map(f => (
                          <li key={f} className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Zap className="size-2 text-primary" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Voltar</Button>
                <Button 
                  className="flex-[2] gap-2" 
                  disabled={busy}
                  onClick={handleFinish}
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4 fill-current" />}
                  Concluir Configuração
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
