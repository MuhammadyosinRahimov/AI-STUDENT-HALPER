"use strict";(()=>{var e={};e.id=749,e.ids=[749],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2048:e=>{e.exports=require("fs")},5315:e=>{e.exports=require("path")},9862:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>R,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>T,staticGenerationAsyncStorage:()=>E});var n={};r.r(n),r.d(n,{DELETE:()=>u,GET:()=>d});var s=r(9303),o=r(8716),a=r(670),i=r(7070),p=r(4304);async function d(e,{params:t}){try{let r=parseInt(t.id),n=(0,p.FO)(r);if(!n)return i.NextResponse.json({error:"Запись не найдена"},{status:404});let{searchParams:s}=new URL(e.url);if("pdf"===s.get("download")&&n.pdf_data){let e=new Uint8Array(n.pdf_data);return new i.NextResponse(e,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${n.type}_${n.id}.pdf"`}})}let{pdf_data:o,...a}=n;return i.NextResponse.json({...a,hasPdf:!!o})}catch(e){return console.error("Get by ID error:",e),i.NextResponse.json({error:"Ошибка получения записи"},{status:500})}}async function u(e,{params:t}){try{let e=parseInt(t.id);if(!(0,p.Jp)(e))return i.NextResponse.json({error:"Запись не найдена"},{status:404});return i.NextResponse.json({success:!0,message:"Запись удалена"})}catch(e){return console.error("Delete error:",e),i.NextResponse.json({error:"Ошибка удаления"},{status:500})}}let c=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/history/[id]/route",pathname:"/api/history/[id]",filename:"route",bundlePath:"app/api/history/[id]/route"},resolvedPagePath:"C:\\Users\\Mardin it\\Desktop\\crs\\student-ai-nextjs\\src\\app\\api\\history\\[id]\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:l,staticGenerationAsyncStorage:E,serverHooks:T}=c,f="/api/history/[id]/route";function R(){return(0,a.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:E})}},4304:(e,t,r)=>{r.d(t,{Jp:()=>T,FO:()=>E,s1:()=>l,vq:()=>c});let n=require("better-sqlite3");var s=r.n(n),o=r(5315),a=r.n(o),i=r(2048),p=r.n(i);let d=a().join(process.cwd(),"data","app.db");function u(){let e=a().dirname(d);return p().existsSync(e)||p().mkdirSync(e,{recursive:!0}),new(s())(d)}function c(e){let t=u(),r=t.prepare(`
    INSERT INTO generations (type, topic, subject, pages, additional_info, content, pdf_data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(e.type,e.topic,e.subject,e.pages,e.additionalInfo||null,e.content,e.pdfBuffer);return t.close(),{id:r.lastInsertRowid}}function l(){let e=u(),t=e.prepare(`
    SELECT id, type, topic, subject, pages, additional_info, created_at
    FROM generations ORDER BY created_at DESC LIMIT 50
  `).all();return e.close(),t}function E(e){let t=u(),r=t.prepare("SELECT * FROM generations WHERE id = ?").get(e);return t.close(),r||null}function T(e){let t=u(),r=t.prepare("DELETE FROM generations WHERE id = ?").run(e);return t.close(),r.changes>0}!function(){let e=u();e.exec(`
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
  `),e.close()}()}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[276,972],()=>r(9862));module.exports=n})();