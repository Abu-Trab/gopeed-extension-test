gopeed.events.on('load', () => {
    console.log("Extension loaded: File Extractor");
});

gopeed.net.intercept('access', async (ctx) => {
    const targetUrl = ctx.req.url;
    if (targetUrl.startsWith('https://extract.local/?url=')) {
        const pageUrl = targetUrl.replace('https://extract.local/?url=', '');
        try {
            const html = await gopeed.runtime.webview.open(pageUrl);
            ctx.res = {
                title: "Extracted Files",
                files: []
            };
        } catch (error) {
            console.error("Error: " + error);
        }
    }
});
