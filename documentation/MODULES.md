# Modules

Liste des différents modules, leurs implémentation existantes et à tester

## app-xxx : Application

Existants :

- app-news : lecteur de flux rss, pour valider le concept sur un cas d'usage réel (le mien)

A tester :

- ...

## distrib-xxx : Distribution de l'application

Existants :

- node : application serveur node classique à laquelle on accède par le navigateur
- browser : PWA pouvant fonctionner en local
- capacitor : Bundle de la PWA avec Capacitor (Cordova mais en mieux) (https://capacitorjs.com/)
- electron : Bundle de l'application avec Electron (https://www.electronjs.org/)

A tester :

- twa : Trusted Web Activity, manière d'encapsuler une PWA dans un APK sans pour autant embarquer une webview (https://developers.google.com/web/android/trusted-web-activity)
- native-webview : Bundle de l'application dans un exe (avec nexe par exemple, https://github.com/nexe/nexe) qui ouvre l'application dans la WebView native de l'OS (avec webopen par exemple, https://github.com/acailly/webopen)
- webextension : Extension Chrome et Firefox
- ...

## expose-xxx : Expose le point d'accès à l'application

Existants :

- pouchdbserver : Utilise un serveur local PouchDB (https://github.com/pouchdb/pouchdb-server)
- localtunnel : Utilise un tunnel SSH via localtunnel (https://github.com/localtunnel/localtunnel)

A tester :

- d'autres services de tunneling comme ngrok ou autres
- tor : utiliser Tor pour créer un Onion Service qui jouera le même rôle que le tunneling classique, avec l'avantage de ne pas reposer sur quelques serveurs précis, et l'inconvénient d'être plus lent. La technique est utilisée par Briar (https://briarproject.org/)
- ...

## pouchdb-xxx : implémentation de pouchdb

Existants :

- default : implémentation par défaut (https://github.com/pouchdb/pouchdb)

A tester :

- git : une implémentation qui utiliserait Git comme base de données clé-valeur, une custom merge stratégy qui copierai celle de CouchDB et ajouterait une interface HTTP compatible CouchDB par dessus tout ca
- ...

## identity-xxx : Gestion de l'identité

Existants :

- uuid : génère un UUID pour l'utilisateur

A tester :

- ulid : génère un ULID (UUID+timestamp, https://github.com/ulid/javascript) pour l'utilisateur
- wallet : génère un couple clé privée/clé publique et se sert de la clé publique comme identifiant
- ...

## secrets-xxx : gestion des secrets

Existants :

- password-openpgpjs : demande de saisir un mot de passe à la connexion, mot de passe qui sera utilisé pour déchiffrer les secrets chiffrés avec OpenPGP.js (https://openpgpjs.org/)

A tester :

- faire des trucs avec la WebCrypto quand elle sera supportée dans Node (https://nodejs.org/api/webcrypto.html)
- ...

## storage-xxx : stockage des données

Existants :

- pouchdb : stocke les données dans une base pouchdb (https://pouchdb.com/)
- file : stocke les données dans des fichiers

A tester :

- sqlite : stocke les données dans une base sqlite (https://www.sqlite.org/index.html)
- ...

## synchronization-xxx : synchronisation des données

Existants :

- pouchdb : utilise pouchdb ((https://pouchdb.com/)) pour synchroniser les données d'une base pouchdb

A tester :

- webdav : utilise Webdav (https://fr.wikipedia.org/wiki/WebDAV) pour synchroniser les données fichier
- ftp : utilise FTP (https://fr.wikipedia.org/wiki/File_Transfer_Protocol) pour synchroniser les données fichier
- hyper : utilise la suite Hypercore-protocol (https://hypercore-protocol.org/) pour synchroniser les données fichier
- ...
