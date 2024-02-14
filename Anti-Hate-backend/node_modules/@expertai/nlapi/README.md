# nlapi-nodejs
**nlapi-nodejs** is a NodeJS client for the expert.ai Natural Language API.  
Natural Language API provides a lot of natural language understanding, document classification and information detection capabilities. You can therefore use this NodeJS client to add all those capabilities to NodeJS applications.  
Useful links for Natural Language API:

- [Live demo](https://try.expert.ai)
- [Documentation](https://docs.expert.ai/nlapi/latest/)
- [Developer portal with API's Swagger UI](https://developer.expert.ai)


This NodeJS client provides a class whose methods map to the resources of Natural Language API REST interface.  
It has methods corresponding to text-processing resources and methods to access API self-documentation resources.

## Installation

Install the client package with this command:

    npm install @expertai/nlapi

## Usage

### Set credentials

You need a developer account to use expert.ai Natural Language API.  
Go to the [expert.ai developer portal](https://developer.expert.ai/ui) and sign up.  
Expert.ai Natural Language API can be used for free up to a monthly limit of 10M characters. If you want to use it above that limit, subscribe a payment plan from inside the expert.ai developer portal or from [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-mzck3lrjdu3i2). Find more information on the [product policies site](https://policies.expert.ai).

Your developer account credentials must be specified as environment variables:

    EAI_USERNAME=YOUR_USERNAME
    EAI_PASSWORD=YOUR_PASSWORD

Replace `YOUR_USERNAME` with the email address you specified during registration on the developer portal and `YOUR_PASSWORD` with the account password.

### Create the client
To use this client in your code, import the `NLClient` class:
    
    // ES5 example
    const { NLClient } = require("@expertai/nlapi")

    // ES6+ example
    import {NLClient} from "@expertai/nlapi"


Then create an instance of the client object:

    let nlClient = new NLClient()

You can then invoke the object methods to use expert.ai Natural Language API.

To use `Language` enum type: 

    // ES5 example
    const { Language } = require("@expertai/nlapi")

    // ES6+ example
    import { Language } from "@expertai/nlapi";

To use `Analysis` enum type:

    // ES5 example
    const { Analysis } = require("@expertai/nlapi")

    // ES6+ example
    import { Analysis } from "@expertai/nlapi";

### Methods

`NLClient` class methods reproduce the behavior of [Natural Language API endpoints](https://docs.expert.ai/nlapi/latest/reference/endpoints/) and have corresponding parameters.

**Full analysis**

Use the `analyze()` method to perform all-inclusive (or "full") [document analysis](https://docs.expert.ai/nlapi/latest/guide/full-analysis/).

    nlClient.analyze("Put your text here.", {
      language: Language.EN,
      context: "standard"
    }).then((result) => {
      console.log(result.data)
    })

`Language` is an enum-like object with all the possible language codes:

    EN = 'en', // English
    ES = 'es', // Spanish
    FR = 'fr', // French
    DE = 'de', // German
    IT = 'it' // Italian

`context` is the name of the context to be used for the analysis. Available contexts can be listed with the `context()` method (see below).

The structure of the returned object is described  [here](https://docs.expert.ai/nlapi/latest/reference/output/full-analysis/).

**Specific/partial document analysis**

Use the `analyze()` method with the `analysis` parameter to perform a specific/partial document analysis choosing from:

- [Deep linguistic analysis](https://docs.expert.ai/nlapi/latest/guide/linguistic-analysis/)
- [Keyphrase extraction](https://docs.expert.ai/nlapi/latest/guide/keyphrase-extraction/)
- [Named entity recognition](https://docs.expert.ai/nlapi/latest/guide/entity-recognition/)
- [Relation extraction](https://docs.expert.ai/nlapi/latest/guide/relation-extraction/)
- [Sentiment analysis](https://docs.expert.ai/nlapi/latest/guide/sentiment-analysis/)

```
nlClient.analyze("Put your text here.", {
  language: Language.EN,
  context: "standard",
  analysis: Analysis.Relations
}).then((result) => {
  console.log(result.data)
```

`Analysis` is an enum-like object with the possible specific/partial analyses:

    Disambiguation = "disambiguation", // Deep linguistic analysis
    Relevants = "relevants", // Keyphrase extraction
    Entities = "entities", // Named entity recognition
    Sentiment = "sentiment", // Sentiment analysis
    Relations = "relations"  // Relation extraction

The structure of the returned object is described  in these pages:

- [`disambiguation` analysis](https://docs.expert.ai/nlapi/latest/reference/output/linguistic-analysis/) (deep linguistic analysis)
- [`relevants` analysis](https://docs.expert.ai/nlapi/latest/reference/output/keyphrase-extraction/) (keyphrase extraction)
- [`entities` analysis](https://docs.expert.ai/nlapi/latest/reference/output/entity-recognition/) (named entity recognition)
- [`relations` analysis](https://docs.expert.ai/nlapi/latest/reference/output/relation-extraction/) (relation extraction)
- [`sentiment` analysis](https://docs.expert.ai/nlapi/latest/reference/output/sentiment-analysis/) (sentiment analysis)

**Document classification**

Use the `categorize()` method to perform [document classification](https://docs.expert.ai/nlapi/latest/guide/classification/) with one of the pre-defined taxonomies.

    nlClient.categorize("test", {
      taxonomy: "iptc",
      language: Language.EN
    }).then((result) => {
      console.log(result.data)
    })

`taxonomy` is one of the Natural Language API [taxonomies](https://docs.expert.ai/nlapi/latest/guide/classification/). Use the `taxonomies()` method (see below) to get the list of available taxonomies together with the language they support.  
The structure of the returned object is described [here](https://docs.expert.ai/nlapi/latest/reference/output/classification/).  
In the case of `geotax` and `emotional-traits` taxonomies, the returned object has an additional `extraData` property. In the former case it contains [GeoJSON](https://docs.expert.ai/nlapi/latest/reference/geojson/), in the latter it contains the [main groups of emotional traits](https://docs.expert.ai/nlapi/latest/reference/emotional-traits-main-groups/).

Use the `taxonomy()` method (see below) to get the category tree for a given taxonomy. i.e. to know about all the possible output categories.

**Information detection**

Use the `detect()` method to perform [information detection](https://docs.expert.ai/nlapi/latest/guide/detection/) with one of the available detectors (for example: PII, Writeprint, Temporal information)

    nlClient.detect("test", {
      language: Language.EN,
      detector: "pii"
    }).then((result) => {
      console.log(result.data)
    })

`detector` is one of the Natural Language API [detectors](https://docs.expert.ai/nlapi/latest/guide/detection/). Use the `detectors()` method (see below) to get the list of available detectors together with the language they support.  
Follow the links [here](https://docs.expert.ai/nlapi/latest/reference/output/detection/) to see the structure of the returned object for each detector.

**API self-documentation: contexts**

    nlClient.context().then((result) => {
      console.log(result)
    })

The method returns the list of available document analysis  [contexts](https://docs.expert.ai/nlapi/latest/guide/contexts-and-kg/).
The returned object is described [here](https://docs.expert.ai/nlapi/v2/reference/output/self-documentation/?#contexts).

**API self-documentation: taxonomies**

    nlClient.taxonomies().then((result) => {
      console.log(result)
    })

The method returns the list of available document classification 
[taxonomies](https://docs.expert.ai/nlapi/latest/guide/classification/taxonomies-info/#list-of-available-taxonomies).
The returned object is described [here](https://docs.expert.ai/nlapi/v2/reference/output/self-documentation/?#taxonomies).

**API self-documentation: category tree**

    nlClient.taxonomy({
      taxonomy: "iptc",
      language: Language.EN
    }).then((result) => {
      console.log(result.data)
    })

The method returns the [category tree](https://docs.expert.ai/nlapi/latest/guide/classification/taxonomies-info/#category-tree) for a given taxonomy in a given language.  
Use the `taxonomies()` method to get the list of available taxonomies together with the language they support.  
The returned object is described [here](https://docs.expert.ai/nlapi/v2/reference/output/self-documentation/?#taxonomies-child-resources).

**API self-documentation: detectors**

    nlClient.detectors().then((result) => {
      console.log(result)
    })

The method returns the list of  [detectors](https://docs.expert.ai/nlapi/latest/guide/detection/) that can be used for information detection.
The returned object is described [here](https://docs.expert.ai/nlapi/v2/reference/output/self-documentation/?#detectors).
