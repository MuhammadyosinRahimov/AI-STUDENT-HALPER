(()=>{var e={};e.id=749,e.ids=[749],e.modules={399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1568:e=>{"use strict";e.exports=require("zlib")},3739:()=>{},9862:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>T,patchFetch:()=>x,requestAsyncStorage:()=>f,routeModule:()=>c,serverHooks:()=>E,staticGenerationAsyncStorage:()=>l});var s={};r.r(s),r.d(s,{DELETE:()=>d,GET:()=>p});var i=r(9303),a=r(8716),n=r(670),o=r(7070),u=r(5748);async function p(e,{params:t}){try{let r=parseInt(t.id),s=await (0,u.FO)(r);if(!s)return o.NextResponse.json({error:"Запись не найдена"},{status:404});let{searchParams:i}=new URL(e.url);if("pdf"===i.get("download")&&s.pdf_data){let e=new Uint8Array(s.pdf_data);return new o.NextResponse(e,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${s.type}_${s.id}.pdf"`}})}let{pdf_data:a,...n}=s;return o.NextResponse.json({...n,hasPdf:!!a})}catch(e){return console.error("Get by ID error:",e),o.NextResponse.json({error:"Ошибка получения записи"},{status:500})}}async function d(e,{params:t}){try{let e=parseInt(t.id);if(!await (0,u.Jp)(e))return o.NextResponse.json({error:"Запись не найдена"},{status:404});return o.NextResponse.json({success:!0,message:"Запись удалена"})}catch(e){return console.error("Delete error:",e),o.NextResponse.json({error:"Ошибка удаления"},{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/history/[id]/route",pathname:"/api/history/[id]",filename:"route",bundlePath:"app/api/history/[id]/route"},resolvedPagePath:"C:\\Users\\Mardin it\\Desktop\\crs\\student-ai-nextjs\\src\\app\\api\\history\\[id]\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:f,staticGenerationAsyncStorage:l,serverHooks:E}=c,T="/api/history/[id]/route";function x(){return(0,n.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:l})}},5748:(e,t,r)=>{"use strict";r.d(t,{FO:()=>o,Jp:()=>u,s1:()=>n,vq:()=>a});var s=r(6923);async function i(){await (0,s.i6)`
    CREATE TABLE IF NOT EXISTS generations (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      topic TEXT NOT NULL,
      subject TEXT NOT NULL,
      pages INTEGER NOT NULL,
      additional_info TEXT,
      content TEXT NOT NULL,
      pdf_data BYTEA,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `}async function a(e){await i();let t=e.pdfBuffer.toString("base64");return{id:(await (0,s.i6)`
    INSERT INTO generations (type, topic, subject, pages, additional_info, content, pdf_data)
    VALUES (
      ${e.type},
      ${e.topic},
      ${e.subject},
      ${e.pages},
      ${e.additionalInfo||null},
      ${e.content},
      decode(${t}, 'base64')
    )
    RETURNING id
  `).rows[0].id}}async function n(){return await i(),(await (0,s.i6)`
    SELECT id, type, topic, subject, pages, additional_info, created_at
    FROM generations 
    ORDER BY created_at DESC 
    LIMIT 50
  `).rows}async function o(e){await i();let t=await (0,s.i6)`
    SELECT id, type, topic, subject, pages, additional_info, content, 
           encode(pdf_data, 'base64') as pdf_data, created_at
    FROM generations 
    WHERE id = ${e}
  `;if(0===t.rows.length)return null;let r=t.rows[0];return{...r,pdf_data:r.pdf_data?Buffer.from(r.pdf_data,"base64"):null}}async function u(e){return await i(),((await (0,s.i6)`
    DELETE FROM generations 
    WHERE id = ${e}
  `).rowCount??0)>0}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972,923],()=>r(9862));module.exports=s})();