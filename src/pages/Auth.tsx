import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Mail, Lock, User, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { formatCPF, cleanCPF, validateCPF } from '@/lib/cpf';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string().trim().email({ message: 'Email inválido' });
const passwordSchema = z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' });

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [cpf, setCpf] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; cpf?: string; fullName?: string }>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
      setErrors((prev) => ({ ...prev, cpf: undefined }));
    }
  };

  const checkCPFExists = async (cpfValue: string): Promise<boolean> => {
    const cleanedCPF = cleanCPF(cpfValue);
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('cpf', cleanedCPF)
      .maybeSingle();
    
    return !!data;
  };

  const validateForm = async () => {
    const newErrors: { email?: string; password?: string; cpf?: string; fullName?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin) {
      if (!fullName.trim()) {
        newErrors.fullName = 'Nome é obrigatório';
      }

      if (!validateCPF(cpf)) {
        newErrors.cpf = 'CPF inválido';
      } else {
        // Check if CPF already exists
        const cpfExists = await checkCPFExists(cpf);
        if (cpfExists) {
          newErrors.cpf = 'Este CPF já está cadastrado';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const isValid = await validateForm();
      if (!isValid) {
        setLoading(false);
        return;
      }
      
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error('Erro ao fazer login. Tente novamente.');
          }
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else {
        // Store CPF in user metadata to be saved after profile creation
        const cleanedCPF = cleanCPF(cpf);
        const { error } = await signUp(email, password, fullName, cleanedCPF);
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error('Erro ao criar conta. Tente novamente.');
          }
        } else {
          toast.success('Conta criada! Seu trial de 7 dias começou.');
          navigate('/');
        }
      }
    } catch (err) {
      toast.error('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-card-foreground">BetMetrics</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-card-foreground">
              {isLogin ? 'Entrar' : 'Criar conta'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin 
                ? 'Acesse sua conta BetMetrics' 
                : 'Comece seu trial gratuito de 7 dias'
              }
            </p>
          </div>

          {/* Trial Banner (only on signup) */}
          {!isLogin && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
              <p className="text-sm text-primary font-medium">
                ✓ 7 dias de acesso total gratuito
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sem limitações durante o período de teste
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm text-card-foreground">
                    Nome completo <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-sm text-card-foreground">
                    CPF <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onChange={handleCPFChange}
                      className={`pl-10 ${errors.cpf ? 'border-destructive' : ''}`}
                      inputMode="numeric"
                    />
                  </div>
                  {errors.cpf && (
                    <p className="text-xs text-destructive">{errors.cpf}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    O CPF é usado para garantir uma conta única por pessoa
                  </p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-card-foreground">
                Email {!isLogin && <span className="text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-card-foreground">
                Senha {!isLogin && <span className="text-destructive">*</span>}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Criar conta e começar trial'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-sm text-primary hover:underline"
            >
              {isLogin 
                ? 'Não tem conta? Criar agora' 
                : 'Já tem conta? Fazer login'
              }
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          BetMetrics: decisões baseadas em dados, não em palpites.
        </p>
      </footer>
    </div>
  );
}
