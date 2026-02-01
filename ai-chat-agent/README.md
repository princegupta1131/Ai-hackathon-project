# SPAN AI Agent

A modern, scalable SPAN AI Chat Application built with **Next.js 14**, featuring multi-modal input support, user authentication, and a clean architecture designed for extensibility.

## 🚀 Features

### User Authentication
- ✅ User registration with validation
- ✅ Login with credential verification
- ✅ Protected routes
- ✅ Session persistence using localStorage

### Chat Interface
- ✅ Modern ChatGPT/Claude-like UI
- ✅ Text messaging with markdown support
- ✅ Voice recording (Web Audio API)
- ✅ Image upload with preview
- ✅ File upload with drag & drop
- ✅ Code block formatting
- ✅ Auto-scroll to latest message
- ✅ Typing indicator

### UI/UX
- ✅ Glassmorphism design
- ✅ Dark theme
- ✅ Responsive layout
- ✅ Smooth animations
- ✅ Accessible components

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── chat/
│   │   ├── components/    # Chat-specific components
│   │   ├── hooks/         # Chat custom hooks
│   │   └── page.tsx       # Chat page
│   ├── globals.css        # Global styles & theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home (redirect)
│
├── components/
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Loader.tsx
│       └── Card.tsx
│
├── lib/                   # Utility libraries
│   ├── aiAgentWrapper.ts  # AI API integration
│   ├── auth.ts            # Authentication functions
│   └── validators.ts      # Form validation
│
├── store/                 # Zustand state management
│   ├── chatStore.ts       # Chat state
│   └── userStore.ts       # User state
│
└── types/                 # TypeScript definitions
    └── index.ts
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd ai-chat-agent

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Dependencies

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Markdown** - Markdown rendering
- **React Hot Toast** - Notifications (optional)
- **Tailwind CSS** - Utility CSS (included but using CSS Modules primarily)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# AI Agent API URL (for production)
NEXT_PUBLIC_AI_API_URL=https://your-api.com/api

# Other configuration
NEXT_PUBLIC_APP_NAME=AI Chat Agent
```

### AI Agent Integration

The `lib/aiAgentWrapper.ts` provides a central function for all AI interactions:

```typescript
import { sendToAIAgent } from '@/lib/aiAgentWrapper';

const response = await sendToAIAgent({
  message: "Hello!",
  attachments: [],
  conversationId: "optional-id"
});
```

Currently uses mock responses. To connect to a real AI backend:
1. Update `AI_AGENT_CONFIG.baseUrl` in `aiAgentWrapper.ts`
2. Uncomment the fetch implementation
3. Adjust request/response handling as needed

## 🎨 Customization

### Theme Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --primary: #667eea;
  --bg-primary: #0f0f23;
  --text-primary: #ffffff;
  /* ... */
}
```

### Adding New Features

1. **New Chat Input Type**: Extend `ChatInput.tsx` and `MessageBubble.tsx`
2. **New Page**: Create folder in `src/app/` with `page.tsx`
3. **New Component**: Add to `src/components/ui/` and export from `index.ts`
4. **New API Integration**: Extend `aiAgentWrapper.ts`

## 📝 Code Standards

- All functions have JSDoc comments with `@description`
- TypeScript interfaces for all data structures
- CSS Modules for component styling
- Zustand for state management
- Proper error handling throughout

## 🚀 Future Enhancements

- [ ] Multi-agent workflow support
- [ ] AI tool calling
- [ ] Knowledge base uploads
- [ ] Workspace collaboration
- [ ] Real-time sync
- [ ] JWT/OAuth authentication
- [ ] Backend API integration
- [ ] Message history persistence (database)

## 📄 License

MIT License
