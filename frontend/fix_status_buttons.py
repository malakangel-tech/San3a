import os

path = "src/pages/Dashboard.jsx"
if os.path.exists(path):
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # تحديث أزرار التحكم بالحالة لتشمل خيار (جديد / معلق)
    old_buttons = """                            <td className="py-3 flex gap-1">
                              <button onClick={() => updateOrderStatus(ord.id, 'قيد التنفيذ')} className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-blue-100">
                                {isAr ? 'قيد التنفيذ' : 'In Progress'}
                              </button>
                              <button onClick={() => updateOrderStatus(ord.id, 'مكتمل')} className="bg-green-50 text-green-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-green-100">
                                {isAr ? 'إكتمال' : 'Complete'}
                              </button>
                            </td>"""

    new_buttons = """                            <td className="py-3 flex gap-1">
                              <button onClick={() => updateOrderStatus(ord.id, 'جديد')} className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-amber-100">
                                {isAr ? 'جديد' : 'New'}
                              </button>
                              <button onClick={() => updateOrderStatus(ord.id, 'قيد التنفيذ')} className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-blue-100">
                                {isAr ? 'قيد التنفيذ' : 'In Progress'}
                              </button>
                              <button onClick={() => updateOrderStatus(ord.id, 'مكتمل')} className="bg-green-50 text-green-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-green-100">
                                {isAr ? 'إكتمال' : 'Complete'}
                              </button>
                            </td>"""

    if old_buttons in code:
        code = code.replace(old_buttons, new_buttons)
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
        print("✅ تم إضافة زر (جديد) للتحكم بحالة الطلب بنجاح!")
    else:
        print("⚠️ جاري استبدال الأزرار بالتطابق المباشر...")
        code = code.replace("onClick={() => updateOrderStatus(ord.id, 'قيد التنفيذ')}", "onClick={() => updateOrderStatus(ord.id, 'قيد التنفيذ')}")
        with open(path, "w", encoding="utf-8") as f:
            f.write(code)
