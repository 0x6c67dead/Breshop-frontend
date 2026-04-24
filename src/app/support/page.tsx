"use client";

import { useState } from "react";
import { useToast } from "@/src/shared/components/ui/Toast";

export default function SupportPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "O NOME É OBRIGATÓRIO";
    if (!formData.email.trim()) {
      newErrors.email = "O E-MAIL É OBRIGATÓRIO";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "E-MAIL INVÁLIDO";
    }
    if (!formData.message.trim()) newErrors.message = "A MENSAGEM É OBRIGATÓRIA";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      showToast("MENSAGEM ENVIADA COM SUCESSO!");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Side: Massive Typography Header */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-7xl md:text-9xl font-serif font-black italic tracking-tighter leading-none text-tactile-dark mb-8">
            HELP <br />
            CENTER
          </h1>
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-tactile-dark/80 max-w-md">
            PRECISA DE AJUDA COM SEU DESAPEGO OU COMPRA? MANDE UMA MENSAGEM PARA NOSSO TIME.
          </p>
          
          <div className="mt-12 flex flex-col gap-4 text-sm font-black uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-accent-orange" />
              RESPOSTA EM ATÉ 24 HORAS
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-accent-lime" />
              SUPORTE ESPECIALIZADO EM CURADORIA
            </div>
          </div>
        </div>

        {/* Right Side: Brutalist Form */}
        <div className="w-full lg:w-1/2 bg-tactile-light p-8 md:p-12 border-[3px] border-tactile-dark hard-shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs font-black uppercase tracking-[0.2em] text-tactile-dark">
                NOME COMPLETO
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="SEU NOME AQUI"
                className={`w-full bg-transparent border-b-[3px] py-3 text-lg font-bold uppercase placeholder:text-tactile-dark/30 focus:outline-none transition-colors ${
                  errors.name ? "border-accent-orange" : "border-tactile-dark"
                }`}
              />
              {errors.name && (
                <span className="text-[10px] font-black text-accent-orange tracking-widest">{errors.name}</span>
              )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-black uppercase tracking-[0.2em] text-tactile-dark">
                E-MAIL DE CONTATO
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="EXEMPLO@EMAIL.COM"
                className={`w-full bg-transparent border-b-[3px] py-3 text-lg font-bold uppercase placeholder:text-tactile-dark/30 focus:outline-none transition-colors ${
                  errors.email ? "border-accent-orange" : "border-tactile-dark"
                }`}
              />
              {errors.email && (
                <span className="text-[10px] font-black text-accent-orange tracking-widest">{errors.email}</span>
              )}
            </div>

            {/* Message Area */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs font-black uppercase tracking-[0.2em] text-tactile-dark">
                COMO PODEMOS AJUDAR?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="DESCREVA SUA DÚVIDA OU PROBLEMA..."
                className={`w-full bg-transparent border-[3px] p-4 text-lg font-bold uppercase placeholder:text-tactile-dark/30 focus:outline-none transition-colors resize-none ${
                  errors.message ? "border-accent-orange" : "border-tactile-dark"
                }`}
              />
              {errors.message && (
                <span className="text-[10px] font-black text-accent-orange tracking-widest">{errors.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-tactile-dark text-tactile-light py-6 text-xl font-black uppercase tracking-widest hover:bg-accent-orange hover:text-tactile-dark transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-[3px] border-tactile-dark hard-shadow"
            >
              {isSubmitting ? "ENVIANDO..." : "ENVIAR MENSAGEM"}
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}
