export const snippets = [
  {
    id: 'Remove current Zendesk Widget and initialise a new widget',
    description:
      'A way to remove the current Zendesk widget and initialise a new one with a different key id',
    content: `
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
    `,
  },
  {
    id: 'Set Custom Metadata using Zendesk SDK formatting',
    description: 'A way to set custom metadata using Zendesk SDK formatting',
    content: `
      const {id: conversationId} = Smooch.getDisplayedConversation();
      Smooch.updateConversation(conversationId, {
        metadata: {
          "zen:ticket:tags": "[tag1, tag2]",
          "zen:ticket_field:<ticket_field_id>": "<value>"
        }
      });
  `,
  },
  {
    id: `Add text in the conversation's header`,
    description: `A way to add text in the conversation's header`,
    content: `
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
  </script>
  `,
  },
  {
    id: 'Custom CSS',
    description:
      'A way to add custom CSS to the widget to remove/change UI elements',
    content: `
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
    </script>
`,
  },
  {
    id: 'Embedded',
    description: 'A way to embed the widget a specific div',
    content: `<script>
Smooch.init({
    integrationId: myIntegrationId,
    embedded: true,
});

setTimeout(() => {
    Smooch.render(document.getElementById('chat-container'));
}, 1000);
</script>`,
  },
  {
    id: 'Widget Left',
    description: 'A way to move the widget to the left',
    content: `<style id="custom-css">
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
  </script>
</body>`,
  },
  {
    id: 'Event Listener Create Conversation',
    description:
      "A way to add an eventListener to the 'Create conversation' button",
    content: `<script>
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
  </script>`,
  },
  {
    id: 'Hide Agent Name',
    description: 'A way to hide the agent name',
    content: `
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
    `,
  },
  {
    id: 'Delegates',
    description: 'Delegates to hide/modify messages',
    content: `
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
    `,
  },
];
