import { ref } from "vue";

const isLoadingSwitchboardUpdate = ref(false);
const switchboards = ref(null);

const smoochConfig = {
  integrationId: import.meta.env.VITE_SUNCO_INTEGRATION_ID,
  canUserSeeConversationList: true,
  soundNotificationEnabled: false,
  // delegate: {
  //   beforeDisplay(message, data) {
  //     console.log(message, data);
  //     return message;
  //   },
  // },
};
const addOnclickListener = () => {
  const webMessenger = document.getElementById("web-messenger-container");
  const messengerContent = webMessenger.contentDocument;
  messengerContent.addEventListener("click", (event) => {
    setTimeout(async () => {
      if (event.target.tagName.toLowerCase() === "button") {
        window.Smooch.createConversation().then((conversation) =>
          window.Smooch.loadConversation(conversation.id)
        );
      }
    }, 100);
  });
};

export const initSunco = (snippetId, smoochVersion = 5) => {
  const suncoScript = document.createElement("script");
  suncoScript.id = snippetId;
  const scriptContent = `
    !function (o, d, s, e, f) {
    var i, a, p, c = [], h = [];
    function t() {
    var t = "5";
    try {
    if (!f) throw new Error(t);
    var e, n = "https://cdn.smooch.io/", r = "smooch";
    e = "string" == typeof this.response ? JSON.parse(this.response) : this.response;
    var o = f.match(/([0-9]+)\.?([0-9]+)?\.?([0-9]+)?/), s = o && o[1], i = o && o[2], a = o && o[3], p = e["v" + s], c = e["v" + s + "." + i + ".patch"];
    if (e.url || p || c) {
    var h = d.getElementsByTagName("script")[0], u = d.createElement("script");
    if (u.async = !0, a) u.src = c || n + r + "." + f + ".min.js"; else {
    if (!(5 <= s && p)) throw new Error(t);
    u.src = p
    }
    h.parentNode.insertBefore(u, h)
    }
    } catch (e) {
    e.message === t && console.error(e)
    }
    }
    o[s] = {
    init: function () {
    i = arguments;
    var t = {
    then: function (e) {
    return h.push({ type: "t", next: e }), t
    },
    catch: function (e) {
    return h.push({ type: "c", next: e }), t
    }
    };
    return t
    },
    on: function () {
    c.push(arguments)
    },
    render: function () {
    a = arguments
    },
    destroy: function () {
    p = arguments
    }
    },
    o.__onWebMessengerHostReady__ = function (e) {
    if (delete o.__onWebMessengerHostReady__, o[s] = e, i) for (var t = e.init.apply(e, i), n = 0; n < h.length; n++) {
    var r = h[n];
    t = "t" === r.type ? t.then(r.next) : t.catch(r.next)
    }
    a && e.render.apply(e, a), p && e.destroy.apply(e, p);
    for (n = 0; n < c.length; n++)e.on.apply(e, c[n])
    };
    var n = new XMLHttpRequest;
    n.addEventListener("load", t), n.open("GET", "https://" + e + ".webloader.smooch.io/", !0), n.responseType = "json", n.send()
    }(window, document, "Smooch", ${import.meta.env.VITE_SUNCO_INTEGRATION_ID}, ${smoochVersion});
    `;

  const scriptElement = document.createElement("script");
  scriptElement.textContent = scriptContent;
  document.body.appendChild(scriptElement);

  window.Smooch.init(smoochConfig).then(() => {
    console.log("SunCo widget ready");
    const user = window.Smooch.getUser();
    console.log(user);
    addOnclickListener();
  });
  window.Smooch.on("widget:opened", () => {
    if (
      !window.Smooch.getUser() ||
      window.Smooch.getConversations().length === 0
    ) {
      window.Smooch.createConversation();
    }
  });
  window.Smooch.on("widget:closed", function () {
    console.log("Widget is closed!");
  });

  window.Smooch.on("ready", () => {
    console.log("window.Smooch is ready");
    // console.log(`Convo length ${window.Smooch.getConversations().length}`)
    // if (window.Smooch.getConversations().length === 0) {
    //   window.Smooch.destroy();
    // }
  });
};

const updateSwitchboard = async (
  enabled = true,
  defaultSwitchboardIntegrationId
) => {
  isLoadingSwitchboardUpdate.value = true;
  const response = await fetch("/integrations/switchboards", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      enabled: Boolean(enabled),
      defaultSwitchboardIntegrationId: defaultSwitchboardIntegrationId,
    }),
  });
  const data = await response.json();
  switchboards.value = data.switchboard;
  isLoadingSwitchboardUpdate.value = false;
};

export { isLoadingSwitchboardUpdate, switchboards, updateSwitchboard };
