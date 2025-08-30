FROM node:24.7-trixie-slim
#og is 2.2gb mine is still 1.3gb -.-"
# more or less based on https://github.com/puppeteer/puppeteer/tree/main/docker with more modern nodejs and UserID fix
#and smaller base also only in one stage for faster builds and starts

# Configure default locale (important for chrome-headless-shell).
ENV LANG=en_US.UTF-8 
ENV DBUS_SESSION_BUS_ADDRESS=autolaunch:
ENV PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer
ENV APP_UID=10042
ENV APP_GID=00000
ENV PPTRUSER_UID=10042


WORKDIR /home/pptruser
COPY . /home/pptruser/

RUN groupadd -r pptruser && useradd -u $PPTRUSER_UID -rm -g pptruser -G audio,video pptruser && \
    chown -R pptruser:pptruser  /home/pptruser/ && \
    su pptruser -c "npm i" && \
    apt-get update && \
    apt-get install -y --no-install-recommends fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg \
    fonts-khmeros fonts-kacst-one fonts-freefont-ttf dbus dbus-x11 && \
    npx puppeteer browsers install chrome --install-deps  && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm uninstall @puppeteer/browsers && \
    chown -R pptruser:pptruser  /home/pptruser/

#ENTRYPOINT [ "/home/pptruser/init.sh" ]
# TODO
# CMD [ "" ]
