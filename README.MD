Projekt prostego, automatycznego sklepu dla serwerów Minecraft udostępniony na licencji [MIT](https://choosealicense.com/licenses/mit/).

# Sposób działania

Sklep wykorzystuje API wpłat [lvlup.pro](https://lvlup.pro), przez co środki z zakupionych usług idą bezpośrednio do wirtualnego portfela na hostingu lvlup.pro. Dzięki temu właściciel może opłacić serwer za zebrane środki.<br>
Z kodem **NIGHTLAND.PL** zniżka **-13%** na zakup VPS KVM w [lvlup.pro](https://lvlup.pro).

# Wymagania

Sklep można zainstalować na serwerze VPS lub dedykowanym oraz na hostingu z NodeJS. **NIE POTRZEBUJESZ** żadnej bazy MySQL ani PHP.

# Instalacja na serwerze VPS lub dedykowanym

Najpierw należy zainstalować **NodeJS** (najlepiej najnowszą wersję) oraz **npm**. W przypadku systemu Ubuntu, można skorzystać na przykład z [tego poradnika](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04) (zainstaluj najnowszą wersję przy użyciu NVM).

Do uruchomienia aplikacji użyjemy **pm2**. Należy je zainstalować (jeśli nie posiadamy). W tym celu należy wpisać kilka komend:<br>
1. `npm install pm2 -g`
2. `pm2 startup`

Teraz należy pobrać pliki. W tym celu możesz użyć komendy `git clone https://github.com/0zelot/ItemShop.git` (pobierze automatycznie pliki do katalogu, w którym się znajdujesz) lub po prostu ręcznie pobrać pliki i wgrać je na serwer.

Jeśli wszystkie pliki znajdują się już na serwerze, znajdując się w katalogu aplikacji, wpisz `npm install`. Zainstaluje to wszystkie potrzebne biblioteki.

Po wykonaniu tych czynności, sklep został zainstalowany. Teraz należy go skonfigurować.

# Konfiguracja

Należy otworzyć plik `config.json`, po czym ustawić w nim następujące wartości: (* gwiazdką oznaczono wartości, które domyślnie są puste, ale wymagane jest ich podanie)

* **PORT**<br>
Port na którym będzie uruchamiany serwer. Nie zmieniaj tego, chyba że pojawią się problemy z uruchomieniem (szczegóły w sekcji z rozwiązywaniem problemów).
* **BREAK**<br>
Tryb przerwy technicznej. Gdy jest ustawione na `true`, nikt nie będzie mógł dokonać zakupu. Nie zmieniaj tego bez potrzeby.
* **TERMSFILE**<br>
Ścieżka do pliku z regulaminem. Zalecane jest pozostawienie tego domyślnie. Aby zmodyfikować regulamin, zedytuj plik `termsfile.html`. 
* **RIGHTSIDEPANEL**<br>
Ścieżka do pliku z niestandardową treścią panelu po prawej stronie. Zalecane jest pozostawienie tego domyślnie. Aby zmodyfikować tekst, zedytuj plik `rightsidepanel.html`. Jeśli chcesz to wyłączyć, pozostaw plik `rightsidepanel.html` pusty.

## Sekcja "general"

* **URL** *<br>
Tutaj należy podać dokładny adres strony. Należy pamiętać o przedrostku `https://` (z certyfikatem SSL) lub `http://` (bez SSL) oraz o dodaniu ukośnika na końcu.<br>
Jeśli chcesz korzystać z HTTPS należy jeszcze wykonać dodatkowe czynności, na przykład według [tego poradnika](https://www.sitepoint.com/configuring-nginx-ssl-node-js/).<br>
Przykład:<br>
`
"url": "http://example.com/",
`
* **NAME** *<br>
Jest to "nazwa" strony.<br>
Przykład:<br>
`"name": "Example.com",`
* **KEYWORDS**<br>
Tagi strony. Należy oddzielać przecinkami, bez spacji.<br>
Przykład:<br>
`"keywords": "ItemShop,Minecraft,Serwer",`
* **FAVICON**<br>
Ścieżka do obrazka favicon, czyli ikony strony. Grafikę najlepiej umieścić w katalogu `/assets/images`<br>
Przykład:<br>
`"favicon": "images/favicon.png",`
* **BACKGROUND**<br>
Ścieżka do tła strony. Grafikę najlepiej umieścić w katalogu `/assets/images`<br>
Przykład:<br>
`"background": "images/background.png",`
* **COLOR** *<br>
Kolor, jest wykorzystywany w tzw. embedach (np. po wysłaniu linku na Discordzie), przez przeglądarki oraz do kilku elementów na stronie. Najlepiej w formacie HEX.<br>
Przykład:<br>
`"color": "#006666",`
* **SERVER_ADDRESS** *<br>
Adres twojego serwera Minecraft. Potrzebny w celu wyświetlania statusu.<br>
Przykład:<br>
`"server_address": "mc.example.com",`
* **LAST_BUYERS**<br>
Liczba ostatnich zakupów wyświetlanych na stronie.<br>
Przykład:<br>
`"last_buyers": 6,`
* **SERVICE_NAME_LIMIT**<br>
Maksymalny limit znaków w nazwie usługi. Zalecane jest pozostawienie tego parametru jako domyślny.<br>
Przykład:<br>
`"service_name_limit": 12,`
* **RIGHTITEM**<br>
Link wyświetlany na pasku nawigacji z prawej strony.<br>
Przykład:<br>
    ```
    "rightitem": {
        "name": "Discord",
        "url": "https://discord.gg/example"
    }
    ```

## Sekcja "important"

* **LVLUPTOKEN** *<br>
Klucz do API twojego konta lvlup.pro (ten długi). Znajdziesz go w panelu lvlup.pro. Zaleca się resetowanie go co jakiś czas. **PAMIĘTAJ!** Nie podawaj nikomu tego klucza i chroń go. Udostępnienie go osobie trzeciej da jej dostęp do twojego konta, w tym także twoich serwerów.<br>
Przykład:<br>
`"lvluptoken": "ABC123XYZ987QWERTY456",`
* **COMMANDS** *<br>
Metoda wykonywania komend - połączenia z serwerem. Dostępne jest wykonywanie komend poprzez **RCON** oraz **API PTERODACTYL**.<br>
Jeżeli korzystasz z [Pterodactyla](https://pterodactyl.io/) - panelu do zarządzania serwerami gier, w tym również Minecraft, lepszym wyborem będzie skorzystać z jego API w celu wykonywania komend.<br>
Jeśli jednak nie korzystasz z panelu, pozostaje skorzystać z **RCON**'a.<br>
Przykład #1:<br>
`"commands": "pterodactyl",`<br>
Przykład #2:<br>
`"commands": "rcon",`<br>
* **PURCHASES**<br>
Sposób zapisu danych o zakupach. Dostępne są **json** (domyślnie) oraz **mysql**. Aby używać zapisu w bazie danych MySQL należy w bazie danych ręcznie utworzyć tabelę. Jej struktura znajduja się w pliku `table.sql`.<br>
Przykład #1:<br>
`"purchases": "json",`<br>
Przykład #2:<br>
`"purchases": "mysql",`<br>
* **PTERODACTYL**<br>
Wymagane tylko w przypadku, jeśli wyżej wybrałeś metodę wykonywania komend poprzez API Pterodactyla. Jeśli wybrałeś RCON, pozostaw puste i przejdź do następnego podpunktu.<br>
    * **URL** *<br>
    Tu należy podać pełen adres do twojego panelu Pterodactyl.<br>
    * **KEY** *<br>
    Tu należy podać klucz API twojego konta do panelu Pterodactyl. Utworzysz go w zakładce `Account API`. **PAMIĘTAJ!** Tego klucza także nikomu nie udostępniaj. Osoba trzecia za jego pomocą może uzyskać dostęp do twoich serwerów w panelu, a nawet je zresetować. W panelu możesz ustawić adresy z których można go użyć, co zwiększy poziom bezpieczeństwa.<br>
    * **SERVER** *<br>
    8-znakowe ID serwera w panelu. Znajdziesz je na stronie głównej po zalogowaniu.<br>
    Przykład:<br>
        ```
        "pterodactyl": {
            "url": "https://panel.example.com",
            "key": "ABC123XYZ987QWERTY456",
            "server": "a1b2c3d4"
        },
        ```
* **RCON**<br>
Wymagane tylko w przypadku, jeśli wyżej wybrałeś metodę wykonywania komend poprzez RCON. Jeśli wybrałeś API Pterodactyla, pozostaw puste i przejdź dalej. Pamiętaj, że domyślnie RCON jest wyłączony i aby z niego korzystać, musisz go włączyć w `server.properties`.<br>
    * **IP** *<br>
    Tu należy podać adres serwera.<br>
    * **PORT** *<br>
    Tu należy podać port RCON. Znajdziesz go w `server.properties`. Domyślnie jest to 25575.<br>
    * **PASSWORD** *<br>
    Hasło do RCON. Ustawisz je w `server.properties`. **PAMIĘTAJ!** Nie udostępniaj nikomu tego hasła. Za jego pomocą można wykonywać komendy poprzez konsolę serwera. Staraj się unikać w haśle RCON specjalnych znaków, ponieważ ich obecnosć może spowodować problem z połączeniem.<br>
    Przykład:<br>
        ```
        "rcon": {
            "ip": "127.0.0.1",
            "port": 25575,
            "password": "XYZ123ABC987SUPERTAJNEHASLO"
        }
        ```
* **DATABASE**<br>
Jeśli zdecydowałeś się na zapis historii zakupów w bazie danych **MySQL**, należy podać tutaj poprawne dana do logowania do bazy danych. Jeśli pozostałeś przy zapisie w **JSON**, nie musisz tu nic wpisywać.<br>
Przykład:<br>
    ```
	"database": {
		"host": "mysql.example.com",
		"user": "root",
		"password": "xyz123abc",
		"database": "s1_database",
		"table": "itemshop_purchases"
    ```

## Sekcja "webhook"

W tym miejscu możesz skonfigurować webhooka Discord, który będzie wysyłany po zakupie. Dzięki temu możesz stworzyć powiadomienia o zakupionych usługach na twoim serwerze Discord.

* **URL**<br>
Link do webhooka. Utworzysz go w ustawieniach kanału. **PAMIĘTAJ!** Nie udostępniaj nikomu tego linku. Osoba trzecia przy jego użyciu może rozsyłać nim spam oraz inne niechciane treści. Jeśli pozostawisz pole puste, ta funkcja będzie wyłączona.<br>
* **TITLE**<br>
Tytuł embeda.
* **TEXT**<br>
Właściwa treść wiadomości. Użyj `[PLAYER]` aby wyświetlić nick gracza, oraz `[SERVICE]`, aby wyświetlić nazwę usługi.<br>
Przykład:<br>
    ```
    "webhook": {
        "url": "https://discordapp.com/api/webhooks/123456789/abc123xyz987qwerty",
        "title": "Zakupiono usługę",
        "text": "[PLAYER] zakupił [SERVICE] w serwerowym sklepie. Gratulacje!"
    },
    ```

## Sekcja "sites"

W tym miejscu możesz skonfigurować nazwy oraz opisy podstron. Możesz także zostawić domyślne wartości.

## Sekcja "navbar"

W tym miejscu możesz skonfigurować pasek nawigacji strony (navbar). Możesz dodawać oraz usuwać linki.
* **URL** *<br>
Link do strony/podstrony.
* **NAME** *<br>
Nazwa wyświetlana na pasku.
* **ICON**<br>
Ikona Font Awesome. Ich listę możesz znaleźć [tutaj](https://fontawesome.com/icons). Jeśli nie chcesz ikony, pozostaw puste.<br>
Przykład:<br>
    ```
        "nazwa": {
            "url": "https://example.com",
            "name": "Pełna nazwa",
            "icon": "fas fa-gavel"
        },
    ```
Pamiętaj o zachowaniu poprawności pliku JSON, ponieważ w innym razie, sklep się nie uruchomi. Do sprawdzenia poprawności pliku możesz użyć na przykład [tego JSON Vaildatora](https://jsonlint.com/?code=).

# Dodawanie usług

Kolejnym krokiem jest skonfigurowanie usług. Zrobisz to w pliku `services.json`. Każda usługa posiada swój numer ID - powinny to być kolejne liczby.<br>

* **NAME** *<br>
Wyświetlana nazwa usługi.<br>
Przykład:<br>
`"name": "Nazwa",`
* **DESCRIPTION** *<br>
Wyświetlany opis usługi.<br>
Przykład:<br>
`"description": "Opis usługi",`
* **IMAGE** *<br>
Ścieżka do obrazka.<br>
Przykład:<br>
`"image": "images/image.png",`
* **PRICE** *<br>
Cena netto usługi. Tyle otrzymasz na swoje konto w lvlup.pro gdy ktoś zakupi usługę. Całkowita cena zakupu jednak będzie większa (w zależności od metody płatności). **PAMIĘTAJ!** Cena musi być liczbą całkowitą, należy ją podać bez cudzysłowów.<br>
Przykład:<br>
`"price": 20,`
* **COMMANDS** *<br>
Komendy wykonywane przez konsolę po zakupie usługi. Użyj `[PLAYER]` w miejscu, gdzie ma się wyświetlić nick gracza.<br>
Przykład:<br>
    ```
    "commands": [
        "say [PLAYER] zakupił usługę."
    ]
    ```

**Przykład nowej usługi:**<br>
```
    "3": {
        "name": "Nazwa",
        "description": "Opis usługi",
        "image": "images/image.png",
        "price": 20,
        "commands": [
            "say [PLAYER] zakupił usługę."
        ]
    }
```

Pamiętaj o zachowaniu poprawności pliku JSON, ponieważ w innym razie, sklep się nie uruchomi. Do sprawdzenia poprawności pliku możesz użyć na przykład [tego JSON Vaildatora](https://jsonlint.com/?code=).

# Uruchomienie sklepu

Po skonfigurowaniu możesz uruchomić stronę. W tym celu wpisz:<br>
`pm2 start app.js --name itemshop`<br>
(_itemshop_ to przykładowa nazwa, którą możesz zmienić)

Aby sprawdzić, czy strona uruchomiła się poprawnie, otwórz logi aplikacji komendą `pm2 logs itemshop` lub wpisz w przeglądarce adres, który podano w konfiguracji. Zalecane jest 

Jeśli na stronie wyświetlił się błąd, najprawdopodobniej coś zostało niepoprawnie skonfigurowane. Należy to poprawić zgodnie z instrukcją.<br>
Jeżeli strona nie odczytała plików CSS itp, upewnij się, że w pliku `config.json` podano URL z przedrostkiem `http://` lub `https://` oraz że na końcu jest ukośnik `/`.
* Aby po zalogowaniu do SSH przejść do logów strony, użyj `pm2 logs itemshop`.<br>
* Aby wyłączyć aplikację, użyj `pm2 stop itemshop`.<br>
* Aby zrestartować aplikację, użyj `pm2 restart itemshop`.<br>
* Pamiętaj, że jeśli wyłączysz aplikację, osoby, które dokonywały w tym czasie zakupu, nie otrzymają swojej usługi. Strona musi działać stabilnie.<br>
* Pamiętaj, żeby po każdej zmianie w plikach konfiguracyjnych zrestartować aplikację.

# Rozwiązywanie problemów

## Listen EADDRINUSE: address already in use :::80

Ten błąd może się pojawić przy próbie uruchomienia strony. Dzieje się tak dlatego, że na twoim serwerze port **80** jest już zajęty przez inną aplikację.<br><br>

Sposób naprawy:<br>
1. Należy zmienić port strony w pliku `config.json`. Na potrzeby poradnika, będzie to **2345**.
    ```
    "port": 2345,
    ```
    Na potrzby poradnika również przyjmiemy, że nasza domena na której zainstalujemy sklep to **example.com**.

2. Potrzebujemy zainstalować Nginx'a (lub Apache, jednak bardziej zalecane jest to pierwsze, poradnik również jest stworzony pod Nginxa). Można to zrobić według [tego poradnika](https://www.sitepoint.com/configuring-nginx-ssl-node-js/). Przed tym jednak warto upewnić się, czy nie jest on już zainstalowany.
3. Mając zainstalowanego Nginx'a, przechodzimy do katalogu `/etc/nginx/sites-available` i tworzymy plik. Na potrzeby poradnika nazwiemy go `itemshop.conf`.
4. Jeżeli chcesz korzystać z SSL (https), wklej do stworzonego w poprzednim punkcie pliku poniższy tekst. Pamiętaj o zmianie danych.
    ```
    server {
            listen 443 ssl http2;
            listen 80;

            # Poniżej wpisz domenę, na której instalujesz sklep
            server_name example.com;

            # Poniżej są 2 linijki dotyczące ścieżki do certyfikatu SSL. Zamień je w razie potrzeby.
            ssl_certificate /etc/ssl/live/example.com/fullchain.pem;
            ssl_certificate_key /etc/ssl/live/example.com/privkey.pem;

            ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
            ssl_prefer_server_ciphers on;
            ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
            location / {
                    proxy_set_header Host $host:$server_port;
                    # W linijce niżej zamień adres IP na adres twojego serwera oraz port, jeśli wybrałeś inny.
                    proxy_pass http://127.0.0.1:2345;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
            }
    }
    ```
    Darmowy certyfikat SSL nabędziesz na przykład od [Cloudflare](cloudflare.com) lub [Let's Encrypt](https://letsencrypt.org/).<br><br>
    Jeśli nie chcesz korzystać z SSL, wklej do tego pliku treść, znajdującą się poniżej. Również pamiętaj o zmianie danych.
    ```
    server {
            listen 80;

            # Poniżej wpisz domenę, na której instalujesz sklep
            server_name example.com;

            location / {
                    proxy_set_header Host $host:$server_port;
                    # W linijce niżej zamień adres IP na adres twojego serwera oraz port, jeśli wybrałeś inny.
                    proxy_pass http://127.0.0.1:2345;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
            }
    }
    ```
5. Zapisz plik. Następnie należy utworzyć symlinka przy użyciu poniższej komendy.
    ```
    ln -s /etc/nginx/sites-available/itemshop.conf /etc/nginx/sites-enabled/itemshop.conf
    ```
6. Teraz należy zrestartować Nginx'a. W Ubuntu jest to:
    ```
    systemctl restart nginx
    ```
    Jeżeli w tym momencie nie pojawił się żaden błąd, to znaczy że wszystko powinno działać jak należy.<br>
    Pamiętaj, jeśli zdecydowałeś się na użycie SSL, pamiętaj o zamienieniu linku do strony w `config.json` tak, aby miał on przedrostek `https://`.

Jeśli występuje jakiś inny błąd, którego tutaj nie ma lub masz pytanie dotyczące projektu, możesz dołączyć do naszego serwera [Discord](https://discord.gg/Zdk5ENd).

# Aktualizacja do nowszej wersji

Aby bezpiecznie zaktualizować sklep do nowszej wersji, należy wykonać kilka czynności.
Najpierw wyłącz aplikację i wykonaj jej kopię zapasową. Jeżeli nie chcesz utracić swojej konfiguracji, usług czy historii zakupów, musisz pamiętać o wcześniejszym skopiowaniu następujących plików:
* config.json
* services.json
* purchases.json (chyba ze korzystasz z bazy danych)

Po tym, należy pobrać nową wersję. W tym celu możesz użyć komendy `git clone https://github.com/0zelot/ItemShop.git` (pobierze automatycznie pliki do katalogu, w którym się znajdujesz) lub po prostu ręcznie pobrać pliki i wgrać je na serwer. Przed tym pamiętaj o usunięciu starych plików.

Jeżeli masz już nową wersję, kolejnym krokiem jest przywrócenie trzech w/w plików. Należy mieć na uwadze, że plik `config.json` po aktualizacji mógł ulec zmianie, dlatego nie należy go bezmyślnie zastępować starym. 

Ostatnim krokiem będzie wpisanie komendy `npm install` oraz uruchomienie sklepu.

# Wygląd

![](https://i.imgur.com/Zl8i4he.png)
Tak wygląda strona główna skonfigurowanego sklepu.<br>

### Możesz także zobaczyć wersję demonstracyjną na żywo odwiedzając [tę stronę](https://ozelot.gq/itemshop/).