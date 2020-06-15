# Adding Dex to your own domain

SwitchDex has a wizard that loads the config on runtime, if you wanna add your domain using the configurations you used on the wizard, just use this
code snippet:

```html
<head>
    <style type="text/css">
        html {height:100%}
        body {
        margin:0;
        height:100%;
        overflow:hidden
        }
    </style>
</head>

<body>
    <iframe allowtransparency=true frameborder=0 id=rf sandbox="allow-same-origin allow-forms allow-scripts" scrolling=auto src="https://mcafeedex.com/#/erc20/?dex=whateverYourDexIDis" style="width:100%;height:100%"></iframe>
</body>
```

## Future Improvements (On Progress)

At the moment all meta data is loaded from SwitchDex or McafeeDex depending of the domain, as improvement is planned add metadata at build time. You
 download the build folder from SwitchDex, change configs and descriptions accordingly and then you will have a fully branded dex connected underhood to Switch Network.