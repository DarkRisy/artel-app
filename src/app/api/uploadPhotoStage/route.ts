import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    // Проверка количества файлов
    if (files.length > 3) {
      return NextResponse.json(
        { message: 'Maximum 3 files allowed' },
        { status: 400 }
      );
    }

    // Создаем директорию для загрузок
    const uploadDir = path.join(process.cwd(), 'public/stages');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating upload directory:', err);
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Проверка размера файла (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        continue;
      }

      // Генерируем уникальное имя файла
      const ext = path.extname(file.name);
      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Сохраняем файл
      const buffer = await file.arrayBuffer();
      await fs.writeFile(filepath, Buffer.from(buffer));

      uploadedUrls.push(`/stages/${filename}`);
    }

    return NextResponse.json({ url: uploadedUrls });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { message: 'File upload failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}