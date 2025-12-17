"use strict";(()=>{var e={};e.id=533,e.ids=[533],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},8259:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>T,patchFetch:()=>R,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>E,staticGenerationAsyncStorage:()=>l});var n={};r.r(n),r.d(n,{GET:()=>u});var o=r(9303),i=r(8716),s=r(670),a=r(7070),p=r(4304);async function u(){try{let e=(0,p.s1)();return a.NextResponse.json(e)}catch(e){return console.error("History error:",e),a.NextResponse.json({error:"Ошибка получения истории"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/history/route",pathname:"/api/history",filename:"route",bundlePath:"app/api/history/route"},resolvedPagePath:"C:\\Users\\Mardin it\\Desktop\\crs\\student-ai-nextjs\\src\\app\\api\\history\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:d,staticGenerationAsyncStorage:l,serverHooks:E}=c,T="/api/history/route";function R(){return(0,s.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:l})}},4304:(e,t,r)=>{r.d(t,{Jp:()=>T,FO:()=>E,s1:()=>l,vq:()=>d});let n=require("better-sqlite3");var o=r.n(n),i=r(5315),s=r.n(i),a=r(2048),p=r.n(a);let u=s().join(process.cwd(),"data","app.db");function c(){let e=s().dirname(u);return p().existsSync(e)||p().mkdirSync(e,{recursive:!0}),new(o())(u)}function d(e){let t=c(),r=t.prepare(`
    INSERT INTO generations (type, topic, subject, pages, additional_info, content, pdf_data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(e.type,e.topic,e.subject,e.pages,e.additionalInfo||null,e.content,e.pdfBuffer);return t.close(),{id:r.lastInsertRowid}}function l(){let e=c(),t=e.prepare(`
    SELECT id, type, topic, subject, pages, additional_info, created_at
    FROM generations ORDER BY created_at DESC LIMIT 50
  `).all();return e.close(),t}function E(e){let t=c(),r=t.prepare("SELECT * FROM generations WHERE id = ?").get(e);return t.close(),r||null}function T(e){let t=c(),r=t.prepare("DELETE FROM generations WHERE id = ?").run(e);return t.close(),r.changes>0}!function(){let e=c();e.exec(`
    CREATE TABLE IF NOT EXISTS generations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      topic TEXT NOT NULL,
      subject TEXT NOT NULL,
      pages INTEGER NOT NULL,
      additional_info TEXT,
      content TEXT NOT NULL,
      pdf_data BLOB,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `),e.close()}()}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[276,972],()=>r(8259));module.exports=n})();