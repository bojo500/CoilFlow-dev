import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Colors 🎨
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    fg: {
        cyan: "\x1b[36m",
        yellow: "\x1b[33m",
        green: "\x1b[32m",
        magenta: "\x1b[35m",
        blue: "\x1b[34m",
        red: "\x1b[31m",
        white: "\x1b[37m"
    }
};

// Animated Frames ⚡
const frames = [
    "🚀 Launching CoilFlow Backend...",
    "🚀 Launching CoilFlow Backend... 🌕",
    "🚀 Launching CoilFlow Backend... 🌓",
    "🚀 Launching CoilFlow Backend... 🌑",
    "🚀 Launching CoilFlow Backend... 🌓",
    "🚀 Launching CoilFlow Backend... 🌕",
];

// Sleep fn
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Animation Runner
async function runAnimation() {
    for (let i = 0; i < 10; i++) {
        const frame = frames[i % frames.length];
        process.stdout.write(`\r${colors.fg.cyan}${frame}${colors.reset}`);
        await delay(120);
    }
    console.log("\n");
}

async function bootstrap() {
    const env = process.env.NODE_ENV || "development";
    const isProd = env === "production";

    console.clear();

    console.log(colors.fg.magenta + "Starting CoilFlow..." + colors.reset);

    // Run boot animation only in development
    if (!isProd) await runAnimation();

    const logo = `
${colors.fg.blue}
   ██████╗ ██████╗ ██╗██╗     ███████╗██╗      ██████╗ ██╗    ██╗
  ██╔════╝██╔═══██╗██║██║     ██╔════╝██║     ██╔═══██╗██║    ██║
  ██║     ██║   ██║██║██║     █████╗  ██║     ██║   ██║██║ █╗ ██║
  ██║     ██║   ██║██║██║     ██╔══╝  ██║     ██║   ██║██║███╗██║
  ╚██████╗╚██████╔╝██║███████╗██     ╗███████╗╚██████╔╝╚███╔███╔╝
   ╚═════╝ ╚═════╝ ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝  ╚══╝╚══╝
${colors.reset}
  `;

    const signature = `
${colors.fg.green}🔥 Developed by Mohamed Khaled${colors.reset}
${colors.fg.yellow}⚙️ Optimized for Manufacturing Workflows ⚙️${colors.reset}
  `;

    console.log(logo);
    console.log(signature);

    console.log(colors.fg.white + "====================================================" + colors.reset);

    // Start App
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(colors.fg.green + "✔ CoilFlow Backend Started Successfully" + colors.reset);
    console.log(colors.fg.white + "----------------------------------------------------" + colors.reset);

    // PRODUCTION UI (Calm + Clean)
    if (isProd) {
        console.log(`
${colors.fg.green}🌍 Mode:                Production${colors.reset}
${colors.fg.blue}🟢 Server:              http://localhost:${port}${colors.reset}
${colors.fg.yellow}🌐 Frontend:            ${process.env.FRONTEND_URL}${colors.reset}
${colors.fg.magenta}🗄 Database Host:       ${process.env.DB_HOST}${colors.reset}
${colors.fg.magenta}🗃 DB Name:             ${process.env.DB_NAME}${colors.reset}
${colors.fg.cyan}📦 API URL:             ${process.env.API_URL}${colors.reset}
    `);
    }

    // DEVELOPMENT UI (More flashy)
    else {
        console.log(`
${colors.fg.red}${colors.bright}🔥 DEVELOPMENT MODE 🔥${colors.reset}

${colors.fg.green}🟢 Server Running On:${colors.reset}      http://localhost:${port}
${colors.fg.yellow}🌐 Frontend URL:${colors.reset}           ${process.env.FRONTEND_URL || "http://localhost:3000"}
${colors.fg.blue}🗄 Database Host:${colors.reset}          ${process.env.DB_HOST || "mysql"}
${colors.fg.magenta}🗃 Database Name:${colors.reset}          ${process.env.DB_NAME || "coilflow"}
${colors.fg.cyan}🎛 Boot Animation:${colors.reset}         enabled
${colors.fg.white}📦 API URL:${colors.reset}                ${process.env.API_URL || `http://localhost:${port}`}
    `);
    }

    console.log(colors.fg.white + "----------------------------------------------------\n" + colors.reset);
}

bootstrap();
