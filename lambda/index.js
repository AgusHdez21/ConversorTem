/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */

const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to Agus. Which conversion would you like to try?',
            HELP_MESSAGE: 'You can convert degrees Fahrenheit to Celsius.',
            GOODBYE_MESSAGE: 'Goodbye!',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MESSAGE: 'Sorry, I had trouble doing what you asked. Please try again.',
            CELSIUS_CONVERSION: '{{degreesFarent}} Fahrenheit is equal to {{degreesCent}} degrees Celsius.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido al conversor . ¿Qué conversión te gustaría probar?',
            HELP_MESSAGE: 'Puedes convertir grados Centigrados a Fahrenheit',
            GOODBYE_MESSAGE: '¡Adiós!',
            FALLBACK_MESSAGE: 'Lo siento, no sé sobre eso. Por favor, inténtalo de nuevo.',
            ERROR_MESSAGE: 'Lo siento, tuve problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.',
            FAHRENHEIT_CONVERSION: '{{degreesCent}} Centigrados son {{degreesFarent}} grados Fahrenheit.'
        }
    }
};

i18n.use(sprintf).init({
    lng: 'en',
    resources: languageStrings,
    returnObjects: true
});

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.cloneInstance({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        });

        handlerInput.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('WELCOME_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const DatosCIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'centIntent';
    },
    handle(handlerInput) {
        const cent = parseFloat(Alexa.getSlotValue(handlerInput.requestEnvelope, 'cent'));
        const fahrenheit = (cent * 9/5) + 32;
        const speakOutput = handlerInput.t('FAHRENHEIT_CONVERSION', { degreesCent: cent, degreesFarent: fahrenheit.toFixed(2) });
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const DatosFIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FarenIntent';
    },
    handle(handlerInput) {
        const farent = parseFloat(Alexa.getSlotValue(handlerInput.requestEnvelope, 'farent'));
        const celsius = (farent - 32) * 5/9;
        const speakOutput = handlerInput.t('CELSIUS_CONVERSION', { degreesFarent: farent, degreesCent: celsius.toFixed(2) });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) !== 'AMAZON.FallbackIntent'; // Evitar manejar el intento de fallback genérico
    },
    handle(handlerInput) {
        // Obtener el nombre del intento y manejarlo de manera específica si es necesario
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        DatosCIntentHandler,
        DatosFIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();