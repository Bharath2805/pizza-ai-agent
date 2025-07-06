graph TD
    A[User Opens App] --> B[Load Menu from Backend]
    B --> C[AI Greets User]
    C --> D[User Chooses Input Method]
    
    D --> E[Text Input]
    D --> F[Voice Input]
    
    E --> G[Type Message]
    F --> H[Click Mic Button]
    H --> I[Speech Recognition]
    I --> J{Auto-Submit ON?}
    J -->|Yes| K[Auto-Send Message]
    J -->|No| L[Fill Input Field]
    L --> M[Press Enter/Send]
    
    G --> N[Send to Backend API]
    K --> N
    M --> N
    
    N --> O[AI Processes Message]
    O --> P[Extract Order Information]
    P --> Q[Generate AI Response]
    Q --> R[Send Response to Frontend]
    
    R --> S[Display AI Message]
    S --> T{Speech Enabled?}
    T -->|Yes| U[Text-to-Speech]
    T -->|No| V[Continue Chat]
    U --> V
    
    V --> W[Update Order Summary]
    W --> X{Order Complete?}
    X -->|No| D
    X -->|Yes| Y[Show Complete Button]
    Y --> Z[User Clicks Complete]
    Z --> AA[Save Order to Database]
    AA --> BB[Show Order Confirmation]
    
    C --> CC[Menu Filter Available]
    CC --> DD[Click Filter Button]
    DD --> EE[Show Category Pills]
    EE --> FF[Select Category]
    FF --> GG[Filter Pizzas]
    GG --> HH[Show in Slider]
    
    style A fill:#e1f5fe
    style BB fill:#c8e6c9
    style O fill:#fff3e0
    style P fill:#fce4ec