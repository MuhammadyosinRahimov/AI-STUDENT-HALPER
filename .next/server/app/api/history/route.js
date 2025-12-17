(()=>{var e={};e.id=533,e.ids=[533],e.modules={399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},4770:e=>{"use strict";e.exports=require("crypto")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},2615:e=>{"use strict";e.exports=require("http")},8791:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1568:e=>{"use strict";e.exports=require("zlib")},3739:()=>{},8259:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>l,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>T,staticGenerationAsyncStorage:()=>E});var s={};r.r(s),r.d(s,{GET:()=>p});var i=r(9303),a=r(8716),o=r(670),n=r(7070),u=r(5748);async function p(){try{let e=await (0,u.s1)();return n.NextResponse.json(e)}catch(e){return console.error("History error:",e),n.NextResponse.json({error:"Ошибка получения истории"},{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/history/route",pathname:"/api/history",filename:"route",bundlePath:"app/api/history/route"},resolvedPagePath:"C:\\Users\\Mardin it\\Desktop\\crs\\student-ai-nextjs\\src\\app\\api\\history\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:E,serverHooks:T}=c,f="/api/history/route";function l(){return(0,o.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:E})}},5748:(e,t,r)=>{"use strict";r.d(t,{FO:()=>n,Jp:()=>u,s1:()=>o,vq:()=>a});var s=r(6923);async function i(){await (0,s.i6)`
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
  `).rows[0].id}}async function o(){return await i(),(await (0,s.i6)`
    SELECT id, type, topic, subject, pages, additional_info, created_at
    FROM generations 
    ORDER BY created_at DESC 
    LIMIT 50
  `).rows}async function n(e){await i();let t=await (0,s.i6)`
    SELECT id, type, topic, subject, pages, additional_info, content, 
           encode(pdf_data, 'base64') as pdf_data, created_at
    FROM generations 
    WHERE id = ${e}
  `;if(0===t.rows.length)return null;let r=t.rows[0];return{...r,pdf_data:r.pdf_data?Buffer.from(r.pdf_data,"base64"):null}}async function u(e){return await i(),((await (0,s.i6)`
    DELETE FROM generations 
    WHERE id = ${e}
  `).rowCount??0)>0}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972,923],()=>r(8259));module.exports=s})();