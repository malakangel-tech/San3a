import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Bot, User, Loader2, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AIAssistant = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: isAr ? 'مرحباً! أنا المساعد الذكي لـ San3a ✨. أرسل لي صورة لمساحتك أو قطعة أثاث تعجبك، وسأساعدك في تحليلها وتصميم ما يناسبك.' : 'Hello! I am San3a AI. Send an image of your space or a furniture piece, and I will help you design it.', 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // التمرير التلقائي لأسفل المحادثة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !imageFile) return;

    const newMessage = { id: Date.now(), text: input, image: imagePreview, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setImagePreview(null);
    setIsLoading(true);

    try {
      // تجهيز البيانات كـ FormData لرفع الصورة والنص للباكند (FastAPI)
      const formData = new FormData();
      if (input) formData.append('prompt', input); // قد نحتاج لتعديل اسم الحقل حسب الباكند
      if (imageFile) formData.append('file', imageFile);

      // المنفذ الافتراضي لـ FastAPI هو 8000
      const response = await fetch('http://localhost:8000/api/v1/analyze-furniture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.result || data.message || data.analysis || (isAr ? 'هذا اختيار رائع! الألوان متناسقة، وأنصحك بتنفيذها بخشب الزان.' : 'Great choice!'),
        sender: 'ai'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: isAr ? 'عذراً، الباكند (السيرفر الذكي) غير متصل حالياً. الرجاء تشغيل سيرفر Python أولاً.' : 'AI Server is currently offline.',
        sender: 'ai',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setImageFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#121212] flex flex-col pt-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col h-[calc(100vh-80px)] bg-white dark:bg-[#1E1E1E] shadow-xl md:rounded-t-3xl border border-gray-100 dark:border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-dark px-6 py-4 flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <h2 className={`font-bold text-lg ${isAr ? '' : 'font-serif'}`}>{isAr ? 'المساعد الذكي - San3a AI' : 'San3a AI Assistant'}</h2>
            <p className="text-xs text-white/70">{isAr ? 'تحليل الصور وتصميم الأثاث' : 'Image Analysis & Furniture Design'}</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-black/20">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-brand-gold' : 'bg-brand-dark'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-brand-dark" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.sender === 'user' ? 'bg-brand-dark text-white rounded-tl-none' : 'bg-white dark:bg-[#2A2A2A] text-gray-800 dark:text-gray-200 rounded-tr-none'} ${msg.isError ? 'border border-red-500 text-red-500' : ''}`}>
                {msg.image && <img src={msg.image} alt="Uploaded" className="max-w-full rounded-xl mb-3 border border-white/10" />}
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-brand-dark rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div>
              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl rounded-tr-none p-4 shadow-sm flex items-center gap-2 text-brand-gold">
                <Loader2 className="w-4 h-4 animate-spin" /> <span className="text-xs">{isAr ? 'جاري التحليل...' : 'Analyzing...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-[#1E1E1E] border-t border-gray-100 dark:border-white/10">
          {imagePreview && (
            <div className="relative inline-block mb-3 ml-2">
              <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-brand-gold shadow-sm" />
              <button onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-3 text-brand-dark dark:text-white bg-gray-100 dark:bg-black/40 rounded-xl hover:bg-brand-gold hover:text-white transition-colors">
              <ImageIcon className="w-5 h-5" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={isAr ? "صف ما تبحث عنه أو أرفق صورة..." : "Describe what you want or attach an image..."}
              className="flex-1 max-h-32 min-h-[50px] p-3 text-sm bg-gray-100 dark:bg-black/40 border border-transparent focus:border-brand-gold dark:text-white rounded-xl outline-none resize-none"
            />
            <button onClick={handleSend} disabled={!input.trim() && !imageFile} className="p-3 bg-brand-dark text-white rounded-xl hover:bg-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
