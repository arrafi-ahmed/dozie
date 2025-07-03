<script setup>
import {getClientPublicImgUrl} from "@/others/util";
import {useDisplay} from "vuetify";

const {xs} = useDisplay();

const scrollTo = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({behavior: "smooth"});
  }
};
</script>

<template>
  <!--    :class="{ 'bg-mobile rounded-xl': xs }"-->
  <v-container class="limit-max-width-xl fill-height landing" fluid>
    <!--    section 1-->
    <v-row
      :class="{
        'bg-mobile rounded-xl': xs,
        'bg-landing-color': !xs,
      }"
      align="center"
      class="rounded-xl"
      no-gutters
    >
      <v-col class="d-none d-sm-flex" cols="5">
        <v-row no-gutters>
          <v-col cols="11">
            <v-img :src="getClientPublicImgUrl('landing1.png')"></v-img>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        :class="{
          'bg-overlay-mobile text-white rounded-xl': xs,
        }"
        class="px-10"
        cols="12"
        md="7"
      >
        <v-row align="center" justify="center">
          <v-col>
            <v-row class="mt-7 mt-md-0" justify="center">
              <v-col
                :class="{ 'bg-overlay-mobile-logo rounded': xs }"
                cols="7"
                md="9"
              >
                <v-img
                  :src="getClientPublicImgUrl('logo.png')"
                  class="v-icon--clickable"
                  @click="$router.push({ name: 'signin' })"
                ></v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col :class="{ 'text-center': xs }">
                <p class="pt-6">
                  Click Event è la soluzione completa per la gestione dei vostri
                  eventi. Semplifica l'organizzazione, migliora l'efficienza e
                  aumenta la soddisfazione dei clienti.
                </p>
                <p class="pt-8">
                  Scoprite come rivoluzionare la gestione dei vostri eventi con
                  la nostra piattaforma intuitiva e potente.
                </p>
              </v-col>
            </v-row>
            <v-row align="center" class="pt-4" justify="center">
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  size="large"
                  @click.prevent="scrollTo('contact_section')"
                >Contattaci
                </v-btn>
              </v-col>
            </v-row>

            <v-row align="center" class="py-4" justify="center">
              <v-col cols="auto">
                <v-img
                  :src="getClientPublicImgUrl('landing2.png')"
                  :width="35"
                ></v-img>
              </v-col>
              <v-col cols="auto">
                <small>by Ferdinando Guzzo Consulting</small>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--    section 2-->
    <v-row class="py-5 py-md-15" justify="center">
      <v-col cols="12" sm="10">
        <h1>Risolvi I Problemi Di Gestione Degli Eventi Con Click Event</h1>
        <v-row class="mt-2 mt-md-4" justify="center">
          <v-col cols="12" md="5" sm="6">
            <v-card
              class="mx-auto h-100 bg-tertiary"
              text="Addio a lunghe attese frustranti. Click Event permette un check-in rapido e senza intoppi grazie alla scansione dei QR code."
              title="Code Agli Ingressi"
            ></v-card>
          </v-col>
          <v-col cols="12" md="5" sm="6">
            <v-card
              text="Niente più errori nella raccolta delle informazioni. Click Event offre una registrazione automatica e precisa tramite moduli personalizzati."
              title="Dati Partecipanti Accurati"
            ></v-card>
          </v-col>
        </v-row>
        <v-row class="mt-2 mt-md-4" justify="center">
          <v-col cols="12" md="5" sm="6">
            <v-card
              class="mx-auto h-100"
              text="Visualizza in tempo reale chi è arrivato e chi manca ancora. Click Event facilita il controllo delle presenze con un semplice sguardo."
              title="Monitoraggio Presenze"
            ></v-card>
          </v-col>
          <v-col cols="12" md="5" sm="6">
            <v-card
              class="mx-auto h-100 bg-tertiary"
              text="Addio a errori e ritardi nell'invio dei biglietti. Click Event genera e invia QR code via email o WhatsApp in modo automatico."
              title="Invio Automatico Biglietti"
            ></v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--    section 3-->
    <v-row class="my-5 my-md-15 py-5 py-md-15 bg-tertiary" justify="center">
      <v-col cols="12" sm="10">
        <h1>I Vantaggi Di Click Event</h1>
        <v-row
          :class="{ 'text-center': xs }"
          class="mt-2 mt-md-4"
          justify="center"
        >
          <v-col cols="12" md="3" sm="6">
            <h2>
              <v-icon>mdi-account-multiple-outline</v-icon>
            </h2>
            <h3>Facilità D'Uso</h3>
            <p>
              Interfaccia intuitiva progettata per essere accessibile a tutti,
              anche ai meno esperti di tecnologia.
            </p>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <h2>
              <v-icon>mdi-fountain-pen-tip</v-icon>
            </h2>
            <h3>Efficienza Massima</h3>
            <p>
              Riduce drasticamente i tempi di gestione, permettendovi di
              concentrarvi sull'esperienza dei clienti.
            </p>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <h2>
              <v-icon>mdi-cctv</v-icon>
            </h2>
            <h3>Sicurezza Avanzata</h3>
            <p>
              QR code unici e invalidazione automatica prevengono accessi non
              autorizzati, garantendo la sicurezza dell'evento.
            </p>
          </v-col>
          <v-col cols="12" md="3" sm="6">
            <h2>
              <v-icon>mdi-window-closed-variant</v-icon>
            </h2>
            <h3>Trasparenza Totale</h3>
            <p>
              Nessuna commissione nascosta sulla vendita dei biglietti, per una
              gestione finanziaria chiara e prevedibile.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--    section 4-->
    <v-row class="my-5 my-md-15" justify="center">
      <v-col cols="12" sm="10">
        <v-row>
          <v-col cols="12" sm="3">
            <v-img
              :src="getClientPublicImgUrl('landing3.png')"
              class="h-100 rounded"
              cover
            ></v-img>
          </v-col>
          <v-col cols="12" sm="9">
            <h1>Un Processo Semplice</h1>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                1
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Creazione Dell'Evento</h3>
                <p>
                  Gli amministratori creano facilmente l'evento e il modulo di
                  registrazione personalizzato per i partecipanti.
                </p>
              </v-col>
            </v-row>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                2
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Registrazione Partecipanti</h3>
                <p>
                  I clienti si registrano in pochi clic e ricevono
                  immediatamente il loro QR code di accesso.
                </p>
              </v-col>
            </v-row>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                3
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Check-In All'Evento</h3>
                <p>
                  Lo staff verifica l'ingresso dei partecipanti semplicemente
                  scansionando i loro QR code all'ingresso.
                </p>
              </v-col>
            </v-row>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                4
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Monitoraggio E Report</h3>
                <p>
                  Dati in tempo reale sulle presenze e report finali dettagliati
                  per analizzare l'evento.
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--    section 5-->
    <v-row class="my-5 my-md-15 py-5 py-md-15 bg-tertiary" justify="center">
      <v-col cols="12" sm="10">
        <h1>Funzionalità Principali</h1>
        <v-row class="mt-2 mt-md-4" justify="center">
          <v-col cols="12" md="4" sm="6">
            <h3>Creazione Eventi Illimitata</h3>
            <p>
              Interfaccia intuitiva per creare e personalizzare eventi in pochi
              clic, con opzioni avanzate per ogni esigenza.
            </p>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <h3>Modulo Di Registrazione Personalizzabile</h3>
            <p>
              Raccogliete i dati essenziali dei clienti con campi
              personalizzabili, ottimizzando il processo di registrazione.
            </p>
          </v-col>
          <v-col cols="12" md="4" sm="6">
            <h3>QR Code Unici e App Di Scansione Efficiente</h3>
            <p>
              Generate e inviate QR code sicuri via email o WhatsApp. Effettuate
              check-in rapidi e sicuri con la nostra app mobile, garantendo un
              flusso fluido all'ingresso.
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--    section 6-->
    <v-row class="my-5 my-md-15" justify="center">
      <v-col cols="12" sm="10">
        <v-row>
          <v-col cols="12" sm="9">
            <h1>Gestione Dei Partecipanti</h1>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                1
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Lista Partecipanti in Tempo Reale</h3>
                <p>
                  Monitorate gli ingressi istantaneamente, ottimizzando la
                  gestione del flusso di persone e la sicurezza.
                </p>
              </v-col>
            </v-row>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                2
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Stato Check-In Dettagliato</h3>
                <p>
                  Visualizzate rapidamente chi è già entrato e chi deve ancora
                  arrivare, per una gestione efficiente degli accessi.
                </p>
              </v-col>
            </v-row>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                3
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Ricerca Avanzata e Report Completi</h3>
                <p>
                  Trovate partecipanti con la ricerca rapida e generate report
                  dettagliati in Excel per analisi approfondite.
                </p>
              </v-col>
            </v-row>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="1"
              ><h1
                :class="{ 'bg-tertiary': !xs }"
                class="text-center rounded"
              >
                4
              </h1></v-col
              >
              <v-col cols="11">
                <h3>Monitoraggio E Report</h3>
                <p>
                  Dati in tempo reale sulle presenze e report finali dettagliati
                  per analizzare l'evento.
                </p>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" order="first" order-sm="last" sm="3">
            <v-img
              :src="getClientPublicImgUrl('landing4.png')"
              class="h-100 rounded"
              cover
            ></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--    section 7-->
    <v-row class="my-5 my-md-15" justify="center">
      <v-col cols="12" sm="10">
        <v-row justify="center">
          <v-col cols="12" sm="3">
            <v-img
              :src="getClientPublicImgUrl('landing5.png')"
              class="h-100 rounded"
              cover
            ></v-img>
          </v-col>

          <v-col cols="12" sm="8">
            <h1>Analisi E Reportistica</h1>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="12">
                <v-table class="border rounded">
                  <tbody>
                  <tr>
                    <td class="py-5">Dati In Tempo Reale</td>
                    <td class="py-5">
                      Visualizzate statistiche di registrazione e check-in
                      aggiornate istantaneamente per ogni evento in corso.
                    </td>
                  </tr>
                  <tr class="bg-grey-lighten-3">
                    <td class="py-5">Analisi Clienti Approfondita</td>
                    <td class="py-5">
                      Comprendete meglio il vostro pubblico con dati
                      demografici e comportamentali dettagliati.
                    </td>
                  </tr>
                  <tr>
                    <td class="py-5">Ottimizzazione Marketing</td>
                    <td class="py-5">
                      Utilizzate i dati raccolti per affinare le strategie di
                      marketing e aumentare l'efficacia delle promozioni.
                    </td>
                  </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!--    section 8-->
    <v-row class="my-5 my-md-15" justify="center">
      <v-col cols="12" sm="10">
        <v-row justify="center">
          <v-col cols="12" sm="8">
            <h1>Rivoluziona I Tuoi Eventi</h1>
            <v-row align="center" class="mt-2 mt-md-4" justify="center">
              <v-col cols="12">
                <div id="contact_section">
                  <p>
                    Contattaci oggi per una demo gratuita e scopri come Click
                    Event può trasformare la gestione dei tuoi eventi.
                    Semplifica, ottimizza e fai crescere il tuo business con la
                    nostra soluzione all-in-one.
                  </p>

                  <h3 class="mt-5">Contatti</h3>
                  <p>
                    Email:
                    <a href="mailto:contact@clickevent.it"
                    >ferdinandoguzzo@gmail.com</a
                    >
                    <br/>
                    Telefono: <a href="tel:+393273471259">+393273471259</a>
                    <br/>
                    Sito Web:
                    <a href="http://www.clickevent.it" target="_blank"
                    >www.ferdinandoguzzo.it</a
                    >
                    <br/>
                    Linkedin:
                    <a
                      href="https://www.linkedin.com/in/ferdinandoguzzo/"
                      target="_blank"
                    >ferdinandoguzzo</a
                    >
                    <br/>
                  </p>

                  <h3 class="mt-5">Grazie Per L'Attenzione</h3>
                  <p>
                    Siamo entusiasti di poter collaborare con voi per rendere i
                    vostri eventi indimenticabili. Non esitate a contattarci per
                    qualsiasi domanda o per iniziare subito con una prova
                    gratuita.
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" order="first" order-sm="last" sm="3">
            <v-img
              :src="getClientPublicImgUrl('landing6.png')"
              class="h-100 rounded"
              cover
            ></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.bg-landing-color {
  background-color: #eeeeee !important;
}

.bg-mobile {
  background: url("/img/landing1.png") !important;
  background-size: cover !important;
  position: relative !important;
}

.bg-overlay-mobile {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.bg-overlay-mobile-logo {
  background-color: rgba(255, 255, 255, 0.9) !important;
}

.landing,
.landing td {
  font-size: 1.2rem !important;
}

.v-card-title {
  font-size: 1.45rem !important;
}

.v-card-text {
  font-size: 1.1rem !important;
}
</style>
