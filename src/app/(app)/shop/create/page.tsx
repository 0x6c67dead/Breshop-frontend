"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/shared/components/ui/Toast";
import { Store, Image as ImageIcon, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

export default function CreateShopPage() {
    const { showToast } = useToast();
    const router = useRouter();
    const [step, setStep] = useState(1);

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        showToast("Seu brechó foi enviado para análise! Em breve você terá seu dashboard.");
        router.push("/");
    };

    return (
        <main className="w-full min-h-screen bg-[#F4F0EB] text-foreground px-4 md:px-12 py-24 flex items-center justify-center">
            <div className="max-w-4xl w-full">
                
                {/* Progress Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-foreground/10 pb-12">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-serif font-black italic tracking-tighter uppercase leading-none">Open Shop.</h1>
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">Junte-se à maior rede de curadoria vintage</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-12 h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-foreground' : 'bg-foreground/10'}`} />
                        ))}
                    </div>
                </div>

                <form onSubmit={handleComplete} className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl border border-foreground/5 flex flex-col gap-12 relative overflow-hidden">
                    
                    {step === 1 && (
                        <div className="flex flex-col gap-10 animate-fade-in">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-serif font-black italic uppercase tracking-tighter">Identidade Básica.</h2>
                                <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">Como sua marca será vista na rede</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-4">Nome do Brechó</label>
                                    <input 
                                        type="text" 
                                        placeholder="EX: ACERVO VINTAGE"
                                        className="bg-[#F4F0EB] border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 ring-foreground/10 transition-all"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-4">Localização Principal</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="EX: SÃO PAULO, SP"
                                            className="w-full bg-[#F4F0EB] border-none rounded-3xl pl-14 pr-8 py-5 text-sm font-bold focus:ring-2 ring-foreground/10 transition-all"
                                            required
                                        />
                                        <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/20" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-4">Bio / Manifesto</label>
                                <textarea 
                                    placeholder="CONTE A HISTÓRIA DA SUA CURADORIA..."
                                    rows={4}
                                    className="bg-[#F4F0EB] border-none rounded-[32px] px-8 py-6 text-sm font-serif italic focus:ring-2 ring-foreground/10 transition-all resize-none"
                                    required
                                />
                            </div>

                            <button 
                                type="button"
                                onClick={() => setStep(2)}
                                className="self-end mt-4 bg-foreground text-background px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-all shadow-xl"
                            >
                                Próximo Passo
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-10 animate-fade-in">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-3xl font-serif font-black italic uppercase tracking-tighter">Estética & Media.</h2>
                                <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest">A cara do seu espaço digital</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-4">
                                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-4">Avatar / Logo</span>
                                    <div className="h-48 bg-[#F4F0EB] rounded-[32px] border-2 border-dashed border-foreground/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-foreground/5 transition-all">
                                        <ImageIcon size={32} className="text-foreground/20" />
                                        <span className="font-mono text-[9px] font-bold text-foreground/40 uppercase">Upload PNG/JPG</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-4">Banner de Fundo</span>
                                    <div className="h-48 bg-[#F4F0EB] rounded-[32px] border-2 border-dashed border-foreground/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-foreground/5 transition-all">
                                        <ImageIcon size={32} className="text-foreground/20" />
                                        <span className="font-mono text-[9px] font-bold text-foreground/40 uppercase">Upload 1200x400</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <button type="button" onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Voltar</button>
                                <button 
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="bg-foreground text-background px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 transition-all shadow-xl"
                                >
                                    Fase Final
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-10 animate-fade-in">
                            <div className="flex flex-col gap-2 text-center items-center">
                                <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-3xl font-serif font-black italic uppercase tracking-tighter">Quase Lá.</h2>
                                <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-widest max-w-xs">Precisamos de alguns dados formais para garantir a segurança da rede</p>
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-4">Responsável Legal (CPF/CNPJ)</label>
                                    <input 
                                        type="text" 
                                        placeholder="000.000.000-00"
                                        className="bg-[#F4F0EB] border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 ring-foreground/10 transition-all"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="font-mono text-[9px] font-black uppercase tracking-widest text-foreground/40 ml-4">Instagram do Brechó</label>
                                    <input 
                                        type="text" 
                                        placeholder="@SEUBRECHO"
                                        className="bg-[#F4F0EB] border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-2 ring-foreground/10 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <button type="button" onClick={() => setStep(2)} className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground">Voltar</button>
                                <button 
                                    type="submit"
                                    className="bg-green-600 text-white px-16 py-6 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-green-700 transition-all shadow-xl"
                                >
                                    Solicitar Abertura
                                </button>
                            </div>
                        </div>
                    )}

                </form>

                {/* Trust Badge */}
                <div className="mt-12 flex flex-col items-center text-center gap-4 text-foreground/40">
                    <ShieldCheck size={24} />
                    <p className="font-mono text-[9px] font-bold uppercase tracking-widest max-w-sm">Ao solicitar a abertura, você concorda com nossos termos de curadoria e taxas de intermediação de moedas (C$).</p>
                </div>
            </div>
        </main>
    );
}
import { ShieldCheck } from "lucide-react";
