import{_ as D,j as c,k as L,a as f,b as a,o as r,d as o,g as T,n as v,f as u,v as h,F as M,e as H,t as y,h as N,l as z}from"./index-DJ2DGYK_.js";import{V as U}from"./VSelect-CfiJvfNI.js";import{b}from"./route-block-B_A1xBdJ.js";const l=[{id:"Pass href locale to metadata",description:"Pass href locale to metadata",content:`
      const currentUrl = new URL(window.location.href);
      const pathSegments = currentUrl.pathname.split('/');
      const languageRegionCode = pathSegments.includes('hc') ? pathSegments[pathSegments.indexOf('hc') + 1] : '';
    `,for:"zendesk"},{id:"Remove current Zendesk Widget and initialise a new widget",description:"A way to remove the current Zendesk widget and initialise a new one with a different key id",content:`
      // remove old widget
      zE('messenger', 'hide'); zE('messenger', 'logoutUser');
      document.getElementById('ze-snippet').remove();
      window.zE = undefined;
      window.zEmbed = undefined;
      window.zEACLoaded = undefined;
      window.zESettings = undefined;

      // add new widget
      var my_awesome_script = document.createElement('script');
      my_awesome_script.id = "ze-snippet";
      my_awesome_script.setAttribute('src','https://static.zdassets.com/ekr/snippet.js?key=<key-goes-here>');
      document.head.appendChild(my_awesome_script);
    `,for:"zendesk"},{id:"Set Custom Metadata using Zendesk SDK formatting",description:"A way to set custom metadata using Zendesk SDK formatting",content:`
      const {id: conversationId} = Smooch.getDisplayedConversation();
      Smooch.updateConversation(conversationId, {
        metadata: {
          "zen:ticket:tags": "tag1, tag2",
          "zen:ticket_field:<ticket_field_id>": "<value>"
        }
      });
  `,for:"sunco"},{id:"Add text in the conversation's header",description:"A way to add text in the conversation's header",content:`
    <script>
    let customCSS = document.createElement("style");
    customCSS.innerHTML = document.getElementById("custom-css").innerText;
    Smooch.init({
      integrationId: myIntegrationId,
      notificationChannelPromptEnabled: false,
      canUserSeeConversationList: false,
      fixedHeader: true,
      integrationOrder: [],
    }).then(
      function () {
        const iframe = document.getElementById("web-messenger-container");
        const iframedocument =
          iframe.contentDocument || iframe.contentWindow.document;
        iframedocument.head.appendChild(customCSS);
        // You can use the querySelector instead of the custom-css that was injected, works the same
        // const panel = iframedocument.querySelector("#wrapper > div.intro-pane.fixed")
        // panel.style.backgroundColor = "#e0dede";
        const privacyBanner = iframedocument.querySelector(
          "#wrapper > div.intro-pane.fixed"
        );
        privacyBanner.innerHTML =
          'This is the welcome banner';
      },
      function (err) {
        // Handle issues during initialization
      }
    );
  <\/script>
  `,for:"sunco"},{id:"Custom CSS",description:"A way to add custom CSS to the widget to remove/change UI elements",content:`
    <style id="custom-css">
    /*       /* set background color for the top part of conversation area */
    /*       #container #conversation .intro-pane {
            background-color: #cdcdcd;
        }

        /* set background color for timestamp header in the conversation area */
    /*       #container #conversation .conversation-timestamp-header {
            color: #000000;
        } */

    /* hide avatars */
    /*       #container #conversation .msg-avatar {
            opacity: 0;
        } */

    #wrapper>div.intro-pane.fixed {
        /*             background-color: #e0dede; */
        text-align: center;
    }

    /* hide Zendesk logo */
    #container #conversation .logo {
        display: none !important;
    }

    /* override the widget depth to not be hidden by mobile fixed header */
    /*       #web-messenger-container {
            z-index: 99999;
        } */

    /* hide avatars */
    #conversation>div.messages-container>div.messages>div.row.left-row>div.msg-wrapper>div.msg-avatar {
        display: none !important;
    }

    #conversation>div>div.messages {
        margin-left: 20px;
    }
    </style>
    </head>

    <body>
    <h1>Welcome to our support page</h1>
    <h3>
        Click on the icon on the right buttom of the page to start a conversation!
    </h3>
    <script>
        const delegate = {
        beforeDisplay(message, data) {
            const conversation = data.conversation;
            if (conversation.metadata) {
                if (conversation.metadata.closed === true) {
                    iframe = document.querySelector("iframe");
                    if (iframe.contentDocument.querySelector("#footer")) {
                        iframe.contentDocument.querySelector(
                            "#footer"
                            ).style.visibility = "hidden";
                            }
                        }
                    }
                    return message;
                },
        };
        const customCSS = document.createElement("style");
        customCSS.innerHTML = document.getElementById("custom-css").innerText;

        Smooch.init({
            integrationId: myIntegrationId,
        notificationChannelPromptEnabled: false,
        canUserSeeConversationList: false,
        fixedHeader: true,
        integrationOrder: []
        }).then(() => {
            const iframe = document.getElementById("web-messenger-container");
        const iframedocument =
            iframe.contentDocument || iframe.contentWindow.document;
        iframedocument.head.appendChild(customCSS);
        // const panel = iframedocument.querySelector("#wrapper > div.intro-pane.fixed")
        // panel.style.backgroundColor = "#e0dede";
        //  const banner = iframedocument.querySelector(
            //    "#wrapper > div.intro-pane.fixed"
        //  );
        //  // banner.innerHTML =
        //  //   '<b>Welcome! Feel free to drop us a message when you want to chat. <a href="https://www.zendesk.com/company/agreements-and-terms/privacy-notice">Here a test link</a>';
        // banner.innerHTML = '<a href="https://www.zendesk.com/company/agreements-and-terms/privacy-notice/">Privacy Policy</a>';
        },
        (err) => {
            console.log(err)
        }
        );
    <\/script>
`,for:"sunco"},{id:"Embedded",description:"A way to embed the widget a specific div",content:`<script>
Smooch.init({
    integrationId: myIntegrationId,
    embedded: true,
});

setTimeout(() => {
    Smooch.render(document.getElementById('chat-container'));
}, 1000);
<\/script>`,for:"sunco"},{id:"Widget Left",description:"A way to move the widget to the left",content:`<style id="custom-css">
    /* override the widget depth to not be hidden by mobile fixed header */
    #web-messenger-container {
      right: auto;
      left: 12px;
    }
    #messenger-button {
      right: auto;
      left: 6px;
    }
    .button-display {
      transform-origin: bottom left;
      bottom: 20px;
    }
  </style>
</head>
<body>
  <script>
    let customCSS = document.createElement("style");
    customCSS.innerHTML = document.getElementById("custom-css").innerText;

    Smooch.init({
      integrationId: <integrationId>,
    }).then(
      function () {
        iframe = document.querySelector("iframe");
        iframe.contentDocument.head.appendChild(customCSS);
      },
      function (err) {
        // Handle issues during initialization
      }
    );
  <\/script>
</body>`,for:"sunco"},{id:"Event Listener Create Conversation",description:"A way to add an eventListener to the 'Create conversation' button",content:`<script>
    Smooch.init({
      integrationId: myIntegrationId,
    }).then(() => {
      var iframe = document.getElementById('web-messenger-container');
      var iframedocument = iframe.contentDocument || iframe.contentWindow.document;
      iframedocument.addEventListener('click', function (evt) {
        initializeButton(iframedocument)
      }, false);
    });

    Smooch.on('widget:opened', function () {
      if (!Smooch.getUser() || Smooch.getConversations().length === 0) {
        Smooch.createConversation({
          displayName: 'First Convo',
          description: 'How can we help you?'
        });
      }
    });

    function initializeButton(iframedocument) {
      var conversationFooter = iframedocument.getElementsByClassName('conversation-group-footer')[0];
      if (conversationFooter) {
        conversationFooter.innerHTML = '<button onclick=parent.createConversation()>New Conversation</button>';
      }
    }
    function createConversation() {
      if (Smooch.isOpened()) {
        Smooch.createConversation().then((conversation) => {
          Smooch.loadConversation(conversation.id);
        })
      }
    }
  <\/script>`,for:"sunco"},{id:"Hide Agent Name",description:"A way to hide the agent name",content:`
    //Update init to include delegate
    delegate: {
        beforeDisplay(message: any, _data: any) {
            if (message.role === 'business') {
                message.displayName = 'agentName'
                message.avatarUrl = 'https://www.gravatar.com/avatar/00000000000000000000000000000000.png?s=200&d=mm'
            }
            return message;
        }
    }
    
    // This function modifies the conversation list by replacing the agent name 
    const modifyConversationList = () => {
        const conversationListPreviewUserText = 'You' // To be modified with custom text is used
        const webMessenger = document.getElementById('web-messenger-container') as HTMLIFrameElement
        const messengerContent = webMessenger.contentDocument as Document
        const descriptions = messengerContent.querySelectorAll('.item-content .description');
        descriptions.forEach(function(description, index) {
            var userName = /.*?(?=:)/.exec(description.innerHTML);
            if (userName) {
                if (userName[0] !== conversationListPreviewUserText) {
                    description.childNodes[0].nodeValue = description!.childNodes[0]!.nodeValue!.replace(userName[0], 'agentName');
                }
            }
        });
    }
    
    // This function modifies the typing indicator details
    const modifyTypingIndicator = () => {
        const webMessenger = document.getElementById('web-messenger-container') as HTMLIFrameElement
        const messengerContent = webMessenger.contentDocument as Document
        const typingIndicator = messengerContent.getElementsByClassName('typing-indicator-container')[0]
        if (!typingIndicator) return
        const nameChild = typingIndicator.querySelector('.from') as HTMLDivElement
        if (nameChild) nameChild.innerText = 'agentName'
        const avatarChild = typingIndicator.querySelector('.typing-indicator-avatar') as HTMLImageElement
        if (avatarChild) {
            avatarChild.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000.png?s=200&d=mm'
            avatarChild.alt = 'agentName Avatar'
        }
    }
    
    // This function listens for any changes in the web widget to modify the conversation list
    const triggerMutationObserver = () => {
        const webMessenger = document.getElementById('web-messenger-container') as HTMLIFrameElement
        const messengerContent = webMessenger.contentDocument as Document
        const observer = new MutationObserver(modifyConversationList);
    
        const observerOptions = {
            childList: true,
            attributes: true,
            subtree: true
        }
    
        const paginatorElem = messengerContent.querySelector('.conversation-list-paginator-container');
        if (paginatorElem) {
            observer.observe(paginatorElem, observerOptions);
        }
    
        const conversationListElem = messengerContent.querySelector('.conversation-list-transition');
        if (conversationListElem) {
            observer.observe(conversationListElem, observerOptions);
        }
    
        const buttonElem = messengerContent.querySelector('.messenger-button-shown');
        if (buttonElem) {
            observer.observe(buttonElem, observerOptions);
        }
    }
    
    // Requires delay before calling this on init
    const triggerTypingMutationObserver = () => {
        const webMessenger = document.getElementById('web-messenger-container') as HTMLIFrameElement
        const messengerContent = webMessenger.contentDocument as Document
        const observer = new MutationObserver(modifyTypingIndicator);
      
        const observerOptions = {
            childList: true,
            attributes: false,
            subtree: false
        }
    
        const messagesListElem = messengerContent.querySelector('.messages');
        if (messagesListElem) {
            observer.observe(messagesListElem, observerOptions);
        }
    }
    `,for:"sunco"},{id:"Delegates",description:"Delegates to hide/modify messages",content:`
    delegate: {
      beforeDisplay(message, data) {
         if (message.metadata && message.metadata.isHidden) {
          return null;
        }
        if (message.role === 'business' && message.source.type === 'zd:agentWorkspace') {
          message.displayName = 'Feedback Assistant';
          message.avatarUrl = businessIconUrl;
        } else if (message.role === 'business' && message.source.type === 'ultimate') {
          message.displayName = 'Virtual Assistant' // TO BE CHANGE
          message.avatarUrl = businessIconUrl; // TO BE CHANGED
        }
        return message;
      }
    ------------------------------------------------------------------------------------
    // Or something similar for the Messaging triggers

    delegate: {
    beforeDisplay(message, data) {
      const businessIconUrl =
        'https://prod3-sprcdn-assets.sprinklr.com/160977/e42863f9-cba8-45ad-a070-12c4be85041d-2041374914/Chatbot_p.jpg';
      if (
        message.role === 'business' &&
        message.source.type === 'zd:agentWorkspace'
      ) {
        console.log(
          message.avatarUrl.includes('static.zdassets.com') &&
            !!message.metadata['__zendesk_msg.trigger.id']
        );
        if (
          message.avatarUrl.includes('static.zdassets.com') &&
          message.metadata &&
          Object.prototype.hasOwnProperty.call(
            message.metadata,
            '__zendesk_msg.trigger.id'
          )
        ) {
          message.avatarUrl = businessIconUrl;
        }
      }
      return message;
    },
  },    
    `,for:"sunco"},{id:"Hide Powered by Sunshine Conversations",description:"Hide the 'Powered by Sunshine Conversations' text",content:`Smooch.on('ready', function() {
      const iframe = document.getElementById('web-messenger-container');
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const style = iframeDoc.createElement('style');
      style.type = 'text/css';
      style.appendChild(iframeDoc.createTextNode('.messages-container .logo { display: none; }'));
      iframeDoc.head.appendChild(style);
    })`,for:"sunco"},{id:"Hide input field from footer",description:"Hide the input field from the footer",content:`
      const toggleFooter = (showInput) => {
      const iframe = document.querySelector('iframe');
      const footer = iframe.contentDocument.querySelector('#footer');
      if (!showInput) {
        if (footer) {
          iframe.contentDocument.querySelector('#footer').style.display = 'none';
        }
      } else {
        if (footer) {
          iframe.contentDocument.querySelector('#footer').style.display = 'flex';
        }
      }
    };
    Smooch.init({
      integrationId: '60a38972b203a100d3e29c51',
      canUserSeeConversationList: false,
    }).then(function () {
      const conversation = Smooch.getDisplayedConversation();
      toggleFooter(conversation.metadata.showInput);
    });
    Smooch.on('message:received', function (message, data) {
      if (message.metadata) {
        toggleFooter(message.metadata.showInput);
      }
    });
    `,for:"sunco"}],B={class:"container mb-4"},q={class:"inline-block mb-2"},O={class:"inline-block mb-2"},A={class:"font-medium text-sm mx-2"},F={class:"font-medium text-sm mx-2"},V={class:"lead"},P={key:0},W=["onClick"],Z={key:0},j={key:1},w={__name:"index",setup(R){const s=c(l[0].id),S=c(null),p=c(null),d=c(!0),m=c(!0),{copy:C,copied:E,isSupported:k}=L({source:S}),I=e=>{C(e.content),p.value=e.id},x=e=>E&&p.value===e,g=()=>{i.value&&i.value.length>0||i.value.push({id:"No snippets found",description:"No snippets found",content:"No snippets found",for:"sunco"}),s.value=i.value[0].id},i=f(()=>l.filter(e=>{if(d.value&&m.value)return e;if(d.value)return e.for==="sunco";if(m.value)return e.for==="zendesk"})),_=f(()=>s.value?l.filter(e=>e.id===s.value):l);return(e,n)=>(r(),a("div",B,[o("div",q,[T(U,{modelValue:s.value,"onUpdate:modelValue":n[0]||(n[0]=t=>s.value=t),label:"Filter by snippet","option-hint":"Select a spinnet",options:i.value},null,8,["modelValue","options"])]),o("div",O,[o("label",A,[v(o("input",{class:"p-checkbox-input",type:"checkbox","onUpdate:modelValue":n[1]||(n[1]=t=>d.value=t),onChange:g},null,544),[[h,d.value]]),n[3]||(n[3]=u(" Sunco ",-1))]),o("label",F,[v(o("input",{class:"p-checkbox-input",type:"checkbox","onUpdate:modelValue":n[2]||(n[2]=t=>m.value=t),onChange:g},null,544),[[h,m.value]]),n[4]||(n[4]=u(" Zendesk ",-1))])]),(r(!0),a(M,null,H(_.value,t=>(r(),a("div",{key:t.id},[o("p",V,y(t.description),1),o("pre",null,[o("code",null,[u(y(t.content),1),z(k)?(r(),a("div",P,[o("button",{class:"p-button p-button-secondary",onClick:G=>I(t)},[x(t.id)?(r(),a("span",j,"Copied!")):(r(),a("span",Z,"Copy"))],8,W)])):N("",!0)])])]))),128))]))}};typeof b=="function"&&b(w);const J=D(w,[["__scopeId","data-v-bfb7ddc5"]]);export{J as default};
