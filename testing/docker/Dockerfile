FROM node:24.7-trixie-slim
#og is 2.2gb mine is still 1.3gb -.-"
# ████████╗ ██████╗ ██████╗  ██████╗     ██████╗ ██╗   ██╗███╗   ██╗   ███████╗██╗  ██╗    ███████╗ ██████╗ ██████╗     ██████╗ ██╗   ██╗██╗██████╗     ██████╗  ██████╗ ██╗██████╗ 
# ╚══██╔══╝██╔═══██╗██╔══██╗██╔═══██╗    ██╔══██╗██║   ██║████╗  ██║   ██╔════╝██║  ██║    ██╔════╝██╔═══██╗██╔══██╗    ██╔══██╗██║   ██║██║██╔══██╗    ██╔══██╗██╔════╝ ██║██╔══██╗
#    ██║   ██║   ██║██║  ██║██║   ██║    ██████╔╝██║   ██║██╔██╗ ██║   ███████╗███████║    █████╗  ██║   ██║██████╔╝    ██████╔╝██║   ██║██║██║  ██║    ██████╔╝██║  ███╗██║██║  ██║
#    ██║   ██║   ██║██║  ██║██║   ██║    ██╔══██╗██║   ██║██║╚██╗██║   ╚════██║██╔══██║    ██╔══╝  ██║   ██║██╔══██╗    ██╔═══╝ ██║   ██║██║██║  ██║    ██╔═══╝ ██║   ██║██║██║  ██║
#    ██║   ╚██████╔╝██████╔╝╚██████╔╝    ██║  ██║╚██████╔╝██║ ╚████║██╗███████║██║  ██║    ██║     ╚██████╔╝██║  ██║    ██║     ╚██████╔╝██║██████╔╝    ██║     ╚██████╔╝██║██████╔╝
#    ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝╚══════╝╚═╝  ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝    ╚═╝      ╚═════╝ ╚═╝╚═════╝     ╚═╝      ╚═════╝ ╚═╝╚═════╝ 
#                                                                                                                                                                                   
# Configure default locale (important for chrome-headless-shell).
ENV LANG=en_US.UTF-8 
# UID of the non-root user 'pptruser'
ENV PPTRUSER_UID=10042
# Attempts to start a new DBUS session if none is present
ENV DBUS_SESSION_BUS_ADDRESS=autolaunch:
ENV PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer



# Add pptruser.
RUN groupadd -r pptruser && useradd -u $PPTRUSER_UID -rm -g pptruser -G audio,video pptruser

# USER $PPTRUSER_UID

WORKDIR /home/pptruser
COPY . /home/pptruser/


# Install @puppeteer/browsers, puppeteer and puppeteer-core into /home/pptruser/node_modules.
# RUN npm i 

# Install system dependencies as root.
# USER root
# Overriding the cache directory to install the deps for the Chrome
# version installed for pptruser. 
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chrome that Puppeteer
# installs, work.

RUN su pptruser -c "npm i" && \
    apt-get update && \
    apt-get install -y --no-install-recommends fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst-one \
    fonts-freefont-ttf dbus dbus-x11 && \
    npx puppeteer browsers install chrome --install-deps  && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm uninstall @puppeteer/browsers && \
    chown -R pptruser:pptruser  /home/pptruser/

# USER $PPTRUSER_UID
ENTRYPOINT [ "init.sh" ]
# Generate THIRD_PARTY_NOTICES using chrome --credits.
