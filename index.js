gopeed.events.on('load', () => {
    console.log("Extension loaded: Advanced File Extractor");
});

gopeed.net.intercept('access', async (ctx) => {
    const targetUrl = ctx.req.url;
    
    try {
        // فتح الصفحة عبر المتصفح الداخلي لجلب المحتوى
        const html = await gopeed.runtime.webview.open(targetUrl);
        
        // استخراج الملفات باستخدام دالة محسنة
        const extractedFiles = extractFiles(html, targetUrl);
        
        ctx.res = {
            title: "All Extracted Files",
            files: extractedFiles
        };
    } catch (error) {
        console.error("Extraction error: " + error);
    }
});

// دالة محسنة لاستخراج الروابط ومعالجة الامتدادات
function extractFiles(htmlContent, baseUrl) {
    const fileLinks = [];
    // تعبير منتظم يلتقط روابط الوسائط والمستندات حتى لو تبعتها معاملات إضافية
    const regex = /(?:src|href)=["']([^"']+\.(?:mp4|mp3|pdf|zip|rar|jpg|jpeg|png|webp|apk)(?:\?[^"']*)?)["']/gi;
    let match;
    
    const baseObj = new URL(baseUrl);
    const seenUrls = new Set(); // لمنع تكرار الملفات

    while ((match = regex.exec(htmlContent)) !== null) {
        let link = match[1];
        
        // معالجة الروابط النسبية وتحويلها إلى روابط كاملة وصحيحة
        if (!link.startsWith('http')) {
            if (link.startsWith('//')) {
                link = baseObj.protocol + link;
            } else if (link.startsWith('/')) {
                link = baseObj.origin + link;
            } else {
                link = baseObj.origin + '/' + link;
            }
        }

        // التأكد من عدم تكرار نفس الرابط
        if (!seenUrls.has(link)) {
            seenUrls.add(link);
            
            // استخراج اسم الملف الصافي وصيغته الصحيحة
            let cleanName = link.split('/').pop().split('?')[0];
            
            fileLinks.push({
                name: cleanName || "download_file",
                url: link
            });
        }
    }
    
    return fileLinks;
}
