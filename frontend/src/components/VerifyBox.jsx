import React, { useState } from 'react';
import { CheckCircle, Upload, CreditCard } from 'lucide-react';

export default function VerifyBox() {
  const [done, setDone] = useState(false);
  return done ? (
    <div className="bg-green-50 p-6 rounded-xl text-center space-y-3">
      <CheckCircle className="w-12 h-12 text-green-600 mx-auto animate-bounce" />
      <h4 className="font-bold text-green-800 text-base">تم تقديم الطلب والدفع بنجاح!</h4>
      <p className="text-xs text-gray-600 dark:text-gray-300">انتظر لمدة <strong>ست ساعات</strong> ريثما يتم مراجعة المستمسكات وتوثيق الحساب.</p>
    </div>
  ) : (
    <form onSubmit={(e) => {e.preventDefault(); setDone(true);}} className="space-y-4 text-xs">
      <h3 className="font-bold text-base border-b pb-3">توثيق الحساب (اشتراك 50$ شهرياً)</h3>
      <input type="text" required placeholder="رقم الهوية أو السجل التجاري" className="w-full p-3 border rounded-xl dark:bg-black/40" />
      <input type="text" required placeholder="اسم الورشة أو الشركة" className="w-full p-3 border rounded-xl dark:bg-black/40" />
      <div className="border-2 border-dashed p-4 text-center rounded-xl text-gray-400"><Upload className="w-6 h-6 mx-auto mb-1 text-brand-gold"/>رفع المستمسكات وصور الورشة</div>
      <div className="bg-gray-50 dark:bg-[#121212] dark:bg-black/20 p-4 rounded-xl space-y-3">
        <p className="font-bold flex items-center gap-1"><CreditCard className="w-4 h-4 text-brand-gold"/> تفاصيل الدفع الشهري ($50)</p>
        <input type="text" required placeholder="رقم البطاقة الائتمانية" className="w-full p-3 border rounded-xl dark:bg-white dark:bg-[#1E1E1E]/10" />
        <div className="grid grid-cols-2 gap-2">
          <input type="text" required placeholder="MM/YY" className="p-3 border rounded-xl dark:bg-white dark:bg-[#1E1E1E]/10" />
          <input type="password" required maxLength="4" placeholder="CVV" className="p-3 border rounded-xl dark:bg-white dark:bg-[#1E1E1E]/10" />
        </div>
      </div>
      <button type="submit" className="w-full bg-brand-gold text-white p-3.5 rounded-xl font-bold uppercase">دفع 50$ وتقديم الطلب</button>
    </form>
  );
}
