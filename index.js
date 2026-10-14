gopeed.events.on('load', () => {
    console.log("Extension loaded: Direct Extractor");
});

// اعتراض الروابط الحقيقية مباشرة عند لصقها في التطبيق
gopeed.net.intercept('access', async (ctx) => {
    const targetUrl = ctx.req.url;
    
    // يمكنك هنا تحديد المواقع التي تريد تفعيل الاستخراج فيها (أو إزالة الشرط لتشغيله على أي رابط)
    if (targetUrl.includes('instagram.com') || targetUrl.includes('quran.ksu.edu.sa')) {
        try {
            // فتح الصفحة عبر المتصفح الداخلي لجلب محتواها الحقيقي
            const html = await gopeed.runtime.webview.open(targetUrl);
            
            // استخراج روابط الملفات والوسائط من الصفحة
            const extractedFiles = extractFiles(html, targetUrl);
            
            // إرسال الملفات المستخرجة للتحميل
            ctx.res = {
                title: "Extracted Media Files",
                files: extractedFiles
            };
        } catch (error) {
            console.error("Extraction error: " + error);
        }
    }
});

// دالة لاستخراج روابط الوسائط والملفات
function extractFiles(htmlContent, baseUrl) {
    const fileLinks = [];
    const regex = /(?:src|href)=["']([^"']+\.(?:mp4|jpg|png|jpeg|webp|pdf|zip))["']/g;
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
        let link = match[1];
        if (!link.startsWith('http')) {
            const baseObj = new URL(baseUrl);
            link = baseObj.origin + link;
        }
        fileLinks.push({
            name: link.split('/').pop().split('?')[0],
            url: link
        });
    }
    return fileLinks;
}
