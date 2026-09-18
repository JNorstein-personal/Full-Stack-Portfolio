# Lor-E — Self-Hosted, RAG-Enabled Personal AI Assistant

Lor-E is a self-hosted, single-user personal AI assistant and knowledge-orchestration system designed to provide persistent, project-aware support across ongoing software, infrastructure, research, business, creative, and planning work.

Rather than functioning as a direct user-to-LLM interface, Lor-E is intended to act as an intermediary between the user, locally maintained knowledge, deterministic software, local language models, current external information, and optional external AI services.

The project combines retrieval-augmented generation (RAG), persistent project knowledge, conversational memory, structured user information, local language-model inference, resource-aware request routing, and a state-driven animated conversational interface.

Lor-E is not an acronym. The name is derived from the opening portion of “Loreweaver,” with an additional “E” added for novelty and character identity.

## Project Purpose

General-purpose conversational AI systems are capable of handling a wide range of requests, but they do not inherently maintain complete, persistent awareness of an individual user's projects, documents, prior decisions, preferences, configuration files, research, or other working context.

As a result, useful information may become fragmented across:

* project files;
* documentation;
* source code;
* notes;
* previous conversations;
* business materials;
* configuration records;
* research sources;
* web resources;
* external applications and services.

Lor-E is intended to provide a persistent intermediary between the user and these information sources.

Its purpose is not to build a new foundation language model or to replace large external language models in every circumstance. Instead, Lor-E is designed to determine what kind of processing a request actually requires and to use appropriately scaled resources whenever possible.

## Core Design Principle: Computational Proportionality

A central architectural principle of Lor-E is computational proportionality:

A task should use no more computational capability than is reasonably necessary to complete it satisfactorily.

Rather than automatically routing every request to the largest or most capable available language model, Lor-E is intended to evaluate whether a request can first be satisfied through a less resource-intensive processing pathway.

A conceptual escalation hierarchy is:

1. Cached information
2. Structured project or application data
3. Direct or semantic retrieval
4. Deterministic application logic
5. An appropriately sized local language model
6. Internet or API retrieval
7. A more capable external language model when the task genuinely warrants it

The hierarchy is an architectural principle rather than an inflexible decision tree. Some requests may require multiple processing methods.

The goal is to make powerful computational resources selective rather than automatic.

## Resource Awareness and Sustainability

Resource conservation is an explicit engineering and ethical objective of the project.

Lor-E is not based on the assumption that local AI is environmentally neutral or inherently more sustainable than cloud AI. Local inference still consumes electricity, computing hardware has embodied environmental costs, and externally hosted AI services remain appropriate for some tasks.

Instead, the project investigates whether software architecture can reduce avoidable computational work by matching tasks to appropriately scaled processing methods.

This includes:

* avoiding unnecessary external LLM invocations;
* retrieving only relevant project information rather than repeatedly processing entire document collections;
* reusing valid cached information where appropriate;
* using deterministic application logic when language-model inference is unnecessary;
* using smaller local models when they are sufficient;
* escalating to more computationally intensive systems only when additional capability is justified;
* reusing existing computing hardware rather than making specialized new AI hardware a baseline requirement.

The defensible sustainability objective is therefore not that every Lor-E interaction will consume fewer resources than an equivalent cloud interaction.

Instead:

Lor-E is designed to reduce avoidable computation and unnecessary external inference where local retrieval or appropriately scaled local processing is sufficient.

## High-Level Architecture

Lor-E is envisioned as a collection of cooperating software components rather than as a single chatbot process.

Conceptually:

```text
User
│
▼
Web-Based User Interface
│
├── Animated Lor-E Avatar
│
▼
Assistant Orchestration Layer
│
├── Cache / Structured Data
├── RAG / Semantic Retrieval
├── Persistent Memory
├── Request Routing
└── Deterministic Application Logic
│
▼
Local Language Model
│
▼
Optional External Resources
├── Web / APIs
└── External LLM Services
│
▼
Generated or Retrieved Response
```

The orchestration layer is responsible for determining which combination of knowledge sources, tools, models, and processing pathways is appropriate for a request.

## Retrieval-Augmented Generation

RAG is one of Lor-E's central technical features.

Project documents can be ingested, divided into useful passages, converted into embeddings, and stored for semantic retrieval.

A representative pipeline is:

```text
Document
  ↓
Text Extraction
  ↓
Chunking
  ↓
Embedding Generation
  ↓
Vector Storage
```

For an applicable user request:

```text
Question
  ↓
Question Embedding
  ↓
Semantic Similarity Search
  ↓
Relevant Project Passages
  ↓
Prompt + Retrieved Context
  ↓
Local LLM
  ↓
Source-Grounded Response
```

Where practical, Lor-E should identify the document, relevant section, and project location used to support an answer.

RAG also serves a resource-management function. Rather than repeatedly submitting large collections of source material to a language model, Lor-E can retrieve only the passages likely to be relevant to the current request.

## Persistent Knowledge and Memory

Lor-E distinguishes among several kinds of persistent information.

### Project Knowledge

Information derived from project source material, such as:

* specifications;
* design decisions;
* documentation;
* source code;
* research;
* business materials;
* configuration information.

This information is primarily handled through the retrieval system.

### Structured Persistent Memory

Durable information that may not originate directly from a document, including:

* preferences;
* project names;
* recurring workflows;
* system configuration;
* explicitly recorded decisions;
* other persistent metadata.

### Conversation Memory

Information used to maintain continuity between interactions, including:

* recent conversation history;
* conversation summaries;
* current context;
* active project.

### Cached Results

Reusable information may include:

* recently retrieved project passages;
* deterministic results;
* repeated answers;
* derived summaries;
* unchanged external information.

Caching must be handled conservatively so that stale information is not incorrectly presented as current.

## Project-Oriented Knowledge Organization

Lor-E is designed to distinguish knowledge belonging to different project contexts.

Examples may include:

```text
Projects
├── Loreweaver Creations
├── H/exicon
├── Norstein-Dashiell Wedding Website
├── Server Infrastructure
└── General Knowledge
```

Each project may maintain its own:

* source documents;
* indexed embeddings;
* structured metadata;
* project-specific memory;
* conversation history;
* optional external references.

Project isolation is intended to reduce irrelevant retrieval and prevent unrelated information from contaminating responses.

## Local Language Model Layer

Lor-E will not train a new foundation model.

Instead, an existing compatible open-weight model will provide local natural-language inference.

Potential model families may include:

* Llama-family models;
* Gemma-family models;
* other locally executable models appropriate to available hardware.

The architecture is intended to abstract the model provider so that Lor-E is not permanently dependent upon one model.

Model selection should consider:

* task complexity;
* required response quality;
* latency;
* available memory;
* computational demand;
* whether a smaller model can adequately complete the request.

The largest available model should not automatically be preferred.

## Internet Retrieval and External AI

Internet retrieval and external language-model integration are separate concerns.

Where current external information is required, Lor-E may eventually retrieve information from:

* web searches;
* specific webpages;
* public documentation;
* external APIs.

Internet retrieval should not automatically imply use of an external language model.

Where practical, current external information may be retrieved and supplied to the local system for processing.

External LLM use is intended to be treated as selective escalation, not as the default final step of every interaction.

External models may eventually be appropriate for requests requiring capabilities such as:

* advanced reasoning;
* unusually large context windows;
* specialized multimodal processing;
* particularly difficult programming or analytical work.

Where external processing is used, Lor-E should transmit only the information reasonably necessary for the requested task.

## Privacy and Security Principles

Because Lor-E may have access to personal and project information, privacy is a core architectural concern.

Design goals include:

* self-hosted single-user operation;
* local storage of project information by default;
* authenticated access;
* encrypted remote connections;
* appropriate filesystem permissions;
* separation of secrets and API credentials;
* controlled access to private project material;
* minimization of unnecessary external transmission;
* explicit or policy-controlled external-service use;
* logging practices that avoid unnecessarily retaining sensitive prompts or content.

A governing principle is:

Local information should not be transmitted to an external language model unless the request requires it or an established routing policy explicitly permits it.

When external transmission is appropriate, only the information reasonably necessary to complete the task should be supplied.

## Lor-E Conversational Interface

Lor-E is planned as a browser-accessible application so that the assistant can remain hosted on the existing server while being accessed from multiple personal devices.

The interface is intended to support:

* conversational prompts and responses;
* project selection;
* retrieved-source citations;
* conversation management;
* visibility into processing state;
* optional indication of whether a response came from retrieval, local inference, Internet retrieval, or an external service.

## Animated Lor-E Avatar

Lor-E is also the name of the assistant's mascot: an animated cartoon spider associated with a hardcover book.

The avatar is intended to serve a functional human-computer interaction role rather than being purely decorative.

Application states may eventually be represented visually through animations such as:

* idle / reading;
* awaiting input;
* cache retrieval;
* searching local knowledge;
* processing;
* local inference;
* Internet retrieval;
* external-model escalation;
* generating a response;
* success;
* insufficient information;
* error;
* sleeping or inactive.

The concept draws limited inspiration from classic character-based desktop assistants in the use of animation to communicate application state, but Lor-E is not intended as a recreation of an existing assistant.

## Proposed Technology Stack

Technology choices remain subject to refinement during implementation.

### Front End

Candidate technologies include:

* React
* Vite
* HTML
* CSS
* JavaScript or TypeScript

### Backend

Candidates include:

* Python with FastAPI
* C# with ASP.NET Core

Python provides a mature ecosystem for AI, embedding, vector-search, and RAG development, while C# aligns with existing software-development experience.

### Local Model Runtime

Potential runtimes include:

* Ollama
* llama.cpp

### Data Storage

Potential technologies include:

* SQLite for structured application data;
* a vector database or vector-search extension for embeddings.

Possible vector-storage technologies include:

* Chroma
* Qdrant
* FAISS
* pgvector

For the initial single-user implementation, simplicity is favored over enterprise-scale infrastructure.

### Deployment

Docker and Docker Compose may be used to support deployment into the existing Ubuntu Server environment.

## Existing Hardware Environment

The project is intended to operate primarily on existing self-hosted infrastructure rather than requiring the purchase of a dedicated AI workstation.

The current target environment includes approximately:

* AMD Ryzen 5 7640HS processor
* 32 GB DDR5 RAM
* 512 GB internal SSD
* 2 TB attached external storage
* Ubuntu Server
* Docker-based service environment

CPU inference is the baseline implementation target.

A dedicated GPU is not required for the minimum viable product. GPU acceleration may be investigated later if testing demonstrates that it provides sufficient practical value.

The project deliberately avoids treating specialized new AI hardware as a prerequisite.

## Minimum Viable Product

The semester MVP is intended to demonstrate:

1. A functioning browser-based chat interface
2. A locally executable language model
3. Support for at least one document format
4. Document ingestion
5. Embedding generation
6. Semantic retrieval
7. RAG-generated responses
8. Project-based document organization
9. Conversation persistence
10. Basic persistent memory
11. Source identification
12. A basic animated Lor-E avatar
13. Multiple operational avatar states
14. Basic request-routing logic distinguishing retrieval from local LLM inference
15. Basic logging of the processing pathway used

The MVP does not require a fully autonomous multi-model agent.

A successful initial implementation should demonstrate that Lor-E can act as an intelligent intermediary instead of merely forwarding every user request directly to a language model.

## Resource and Routing Telemetry

Lightweight telemetry may be used to evaluate the resource-aware architecture.

Potential measurements include:

* processing pathway selected;
* model used;
* response-generation time;
* cache hits;
* local-model invocations;
* external-model invocations;
* approximate CPU or memory utilization;
* approximate energy use where practical.

The purpose is comparative evaluation rather than laboratory-grade environmental accounting.

A useful evaluation question is:

How many representative project-management requests can be satisfactorily completed without invoking an external language model?

## Development Methodology

Lor-E is intended to use an iterative or incremental software-development process.

Representative development iterations include:

1. Application skeleton and local inference
2. Document ingestion and embeddings
3. RAG implementation
4. Persistence and project organization
5. Resource-aware request routing
6. Avatar and UI state integration
7. Testing, optimization, sustainability evaluation, and documentation

Each iteration should produce a functional increment of the system.

## Testing Priorities

Testing is expected to include:

* unit testing;
* integration testing;
* retrieval-quality testing;
* hallucination and insufficient-information testing;
* routing behavior;
* performance;
* resource utilization;
* cache behavior;
* external-inference avoidance;
* user acceptance testing.

Routing tests should deliberately include requests requiring different levels of computational capability so that the system's escalation behavior can be evaluated.

## Success Criteria

The prototype will be considered successful when it can demonstrate that:

* Lor-E executes locally;
* project documents can be ingested;
* semantically relevant information can be retrieved;
* responses can be generated using retrieved sources;
* supporting source documents can be identified;
* application information persists between sessions;
* avatar states correspond to application activity;
* basic operation does not depend upon cloud inference;
* retrieval-only requests can be distinguished from requests requiring local generation;
* the system does not automatically route every request to the most computationally intensive available model;
* sufficient routing telemetry exists to evaluate which categories of requests can be satisfactorily completed without external LLM escalation.

## Future Development

Potential future capabilities include:

* Internet retrieval
* External LLM integration
* Automatic external-model escalation
* Multiple local models
* Dynamic model selection
* Filesystem monitoring and automatic reindexing
* Advanced caching
* Response-cost estimation
* Local energy-use measurement
* Routing analytics
* Voice input and output
* Multimodal processing
* More advanced avatar animation
* Proactive notifications
* External application integrations
* Automated memory extraction

Future resource-oriented research may include:

* energy-aware routing;
* model-specific efficiency measurements;
* hardware-utilization monitoring;
* improved embedding efficiency;
* quantization comparisons;
* workload-specific model selection;
* renewable-energy-aware scheduling where applicable.

These are future development opportunities rather than requirements of the initial MVP.

## Potential Public-Facing Version

The underlying architecture may eventually support a separate, restricted implementation of Lor-E for the Loreweaver Creations website.

A public-facing version could share elements such as:

* application architecture;
* Lor-E's name and mascot;
* interface concepts;
* selected source code;
* public knowledge retrieval.

It would not share the private personal knowledge base, project memory, administrative information, or unrestricted tools of the personal version.

Any public implementation would require substantially stricter access controls and information boundaries.

## Project Status

Active development / academic software-engineering project

Current work focuses on requirements, system architecture, technology selection, resource-routing design, and preparation for implementation on the existing Ubuntu Server environment.

## Portfolio Focus

Lor-E is intended to demonstrate practical work across:

* full-stack application architecture;
* retrieval-augmented generation;
* semantic search;
* local language-model integration;
* persistent knowledge and memory;
* AI orchestration;
* privacy-conscious software design;
* resource-aware computing;
* self-hosted deployment;
* human-computer interaction;
* state-driven UI design;
* systems integration;
* software testing and evaluation.

The project's technical contribution lies in integrating existing AI technologies into an original software architecture rather than attempting to create a new foundation model.

## Development and AI-Assistance Disclosure

AI-assisted tools may be used during planning, research, architecture exploration, debugging, documentation, code review, and other development activities.

AI assistance is treated as a development tool rather than a substitute for technical ownership. Architecture, implementation, integration decisions, testing, validation, deployment, and final project behavior remain the responsibility of the project author.

Third-party models, libraries, frameworks, services, and other dependencies will be identified where relevant.

## Project Identity

Lor-E is best understood not simply as a chatbot, but as a local-first personal knowledge and AI orchestration platform.

Its purpose is to place a persistent, project-aware intermediary between the user and increasingly powerful computational resources: answering locally when retrieval or appropriately scaled local processing is sufficient, retrieving current external information when necessary, and escalating to more capable AI systems only when a task genuinely warrants their capabilities.



