# Overview
This file provides a high-level overview of the architecture of the application. The system consists of a backend orchestrator managing autonomous agents via SQLite and Socket.IO, and a React frontend for observing and interacting with them.

The backend uses a Swarm Protocol over SQLite to facilitate inter-agent communication and task delegation. Each agent runs isolated and communicates via asynchronous events. The frontend provides real-time visualization of agent states, task queues, and chat logs.
