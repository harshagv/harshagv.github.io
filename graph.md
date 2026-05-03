# Codebase Architecture Graph

Here is the architectural topology of your DevSecOps portfolio. It outlines the DOM hierarchy, rendering pipelines, and component relationships, separating standard React rendering from your WebGL/GSAP engines.

```mermaid
graph TD
    %% Core Styling & Config
    classDef core fill:#111,stroke:#00ff66,stroke-width:2px,color:#fff
    classDef webgl fill:#051b2c,stroke:#0CAFFF,stroke-width:2px,color:#fff
    classDef section fill:#1e1e1e,stroke:#444,stroke-width:1px,color:#eee
    classDef util fill:#2a1b38,stroke:#9b51e0,stroke-width:1px,color:#fff
    classDef boot fill:#401515,stroke:#ff3333,stroke-width:2px,color:#fff

    %% Entry Points
    Root["index.html"] --> Main["main.tsx"]
    Main --> App["App.tsx (Global Routing & Lenis Smooth Scroll)"]
    App:::core

    %% Application Layers
    App --> BootLayer["1. Initialization Layer"]
    App --> EnvLayer["2. Environmental/Physics Layer"]
    App --> ContentLayer["3. DOM Content Layer"]

    %% 1. Initialization
    BootLayer --> BootSequence["BootSequence.tsx"]
    BootSequence:::boot

    %% 2. Physics & Environment
    EnvLayer --> Cursor["Cursor.tsx (Custom Physics)"]
    EnvLayer --> Noise["Noise.tsx (CRT Interference)"]
    EnvLayer --> Canvas["@react-three/fiber Canvas"]
    
    %% WebGL Engine
    Canvas --> Scene["Scene.tsx (3D Astrolabe & WebGL Stars)"]
    Scene:::webgl

    %% 3. Main Content
    ContentLayer --> Navbar["Navbar.tsx"]
    ContentLayer --> MainLayout["<main> (Sections)"]
    ContentLayer --> Footer["Footer.tsx"]
    ContentLayer --> FloatTerm["FloatingTerminal.tsx"]

    %% Sections
    MainLayout --> Hero["Hero.tsx"]
    MainLayout --> About["About.tsx"]
    MainLayout --> Experience["Experience.tsx"]
    MainLayout --> ScrollKinetics["ScrollKinetics.tsx (GSAP Pinned Scroll-Jacking)"]
    MainLayout --> Certs["Certifications.tsx"]

    Hero:::section
    About:::section
    Experience:::section
    ScrollKinetics:::section
    Certs:::section

    %% Primitives / Utilities
    Hero -.-> MagneticButton["MagneticButton.tsx"]
    Hero -.-> FramerSplitText["FramerSplitText.tsx (Active Scan Typography)"]
    Navbar -.-> MagneticButton
    Footer -.-> MagneticButton
    Footer -.-> FramerSplitText
    
    Certs -.-> Odometer["Odometer.tsx (Kinetic Number Count)"]

    MagneticButton:::util
    FramerSplitText:::util
    Odometer:::util
```

## Matrix Breakdown
* **Initialization Layer (Red)**: Handles absolute system mount and loading. Completely blocks execution of physics until booted.
* **Physics & WebGL Layer (Blue/Green)**: Houses raw Three.js nodes (`Scene.tsx`) and persistent DOM overlays (`Cursor`, `Noise`). Locked underneath the viewport.
* **Content Layer (Gray)**: Standard React component hierarchy that utilizes `Lenis` smooth scrolling and `GSAP` scrubbers to interact with the environment.
* **Primitive Engines (Purple)**: Highly reusable utility components driving typography and button kinetics across multiple parent sections.
