# 🍽️ SmartDine AI Chatbot

An AI-powered restaurant assistant that provides personalized food recommendations based on user preferences, dietary restrictions, and nutritional needs.

## 📌 About The Project

SmartDine features an interactive chatbot that helps users explore menus, make informed choices, and enjoy a smarter dining experience. It combines AI-driven recommendations with a clean, intuitive interface to make food discovery effortless.

## ✨ Features

- 🤖 AI-powered chatbot for personalized food recommendations
- 🥗 Dietary restriction and nutritional needs support
- 📋 Interactive menu exploration
- 🔍 Smart filtering based on user preferences
- 💡 Informed dining decisions powered by AI

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express |
| Database | SQL (PostgreSQL) |
| AI | Claude AI (Anthropic) |

## 📁 Project Structure

```
SmartDine-AI-Chatbot/
├── frontend/         # React + Vite frontend
├── backend/          # Node.js + Express API
└── database/         # SQL schema and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/m10azz/SmartDIne-AI-Chatbot.git
   cd SmartDIne-AI-Chatbot
   ```

2. **Setup Backend**
   ```bash
   cd smartdine/backend
   npm install
   cp .env.example .env
   # Add your environment variables in .env
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd smartdine/frontend
   npm install
   npm run dev
   ```

4. **Setup Database**
   - Run the SQL schema from `smartdine/database/`

## 🔐 Environment Variables

Create a `.env` file in the backend folder:
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

## 📸 Screenshots

*Coming soon*

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ by [Azzan](https://github.com/m10azz)
