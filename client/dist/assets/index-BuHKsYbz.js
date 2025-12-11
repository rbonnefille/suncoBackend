import{_ as h,j as c,k as C,a as S,b as o,o as s,d as n,g,l as d,F as V,e as A,t as p,f as N,h as T}from"./index-DJ2DGYK_.js";import{V as B}from"./VSelect-CfiJvfNI.js";import{b as u}from"./route-block-B_A1xBdJ.js";const i=[{id:"Prevent Agent Workspace to display CSAT messages",description:"Agent Workspace will not display CSAT messages if the metadata type is csat",content:`
    {
      "author": {
        "type": "business",
        "avatarUrl": "https://url-of-your-brand-image.com",
        "displayName": "Customer Service"
      },
      "content": {
        "type": "text",
        "text": "Rate your conversation",
        "actions": [
          {
            "type": "link",
            "text": "CSAT Here",
            "uri": "https://api.simplesat.io/api/rating/xxxxxxxxxxxx/{{ticket.id}}/?source=zendesk"
          }
        ]
      },
      "metadata": {
        "type": "csat"
      }
    }
  `}],F={class:"container mb-4"},I={class:"inline-block mb-2"},U={class:"lead"},W={key:0},j=["onClick"],w={key:0},z={key:1},m={__name:"index",setup(D){const a=c(i[0].id),_=c(null),r=c(null),{copy:x,copied:y,isSupported:f}=C({source:_}),v=e=>{x(e.content),r.value=e.id},k=e=>y&&r.value===e,b=S(()=>a.value?i.filter(e=>e.id===a.value):i);return(e,l)=>(s(),o("div",F,[n("div",I,[g(B,{modelValue:a.value,"onUpdate:modelValue":l[0]||(l[0]=t=>a.value=t),label:"Filter by snippet","option-hint":"Select a spinnet",options:d(i)},null,8,["modelValue","options"])]),(s(!0),o(V,null,A(b.value,t=>(s(),o("div",{key:t.id},[n("p",U,p(t.description),1),n("pre",null,[n("code",null,[N(p(t.content),1),d(f)?(s(),o("div",W,[n("button",{class:"p-button p-button-secondary",onClick:E=>v(t)},[k(t.id)?(s(),o("span",z,"Copied!")):(s(),o("span",w,"Copy"))],8,j)])):T("",!0)])])]))),128))]))}};typeof u=="function"&&u(m);const R=h(m,[["__scopeId","data-v-ce22c583"]]);export{R as default};
