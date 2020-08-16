# Automatyczne aktualizacje, zalecane pozostawienie włączonych
AUTOUPDATE=true

if [ $1 ]
then
    if (( $1 == "install" ))
    then
        if (( $AUTOUPDATE == true ))
        then
            git init
            echo "Pobieranie..."
            git pull https://github.com/0zelot/ItemShop.git
            npm install
            echo "Pobrano pliki i biblioteki."
            echo "Pomyślnie zainstalowano."
        else
            git clone https://github.com/0zelot/ItemShop.git
            npm install
        fi
    else 
        if (( $1 == "start" ))
        then
            if (( $AUTOUPDATE == true ))
            then
                git init
                echo "Sprawdzanie aktualizacji..."
                git pull https://github.com/0zelot/ItemShop.git
                npm install
                echo "Gotowe."
            else
                npm install
                pm2 start app.js --name itemshop
            fi
        else
            echo "Niepoprawne użycie."
        fi
    fi
else
    echo -e "\n\nPoprawne użycie:\n"
    echo "./itemshop.sh install - rozpoczyna instalację"
    echo -e "./itemshop start - uruchamia aplikację \n\n"
fi