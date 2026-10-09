use std::fs;
use std::path::Path;

#[tauri::command]
fn read_document_file(path: String) -> Result<Vec<u8>, String> {
    fs::read(&path).map_err(|e| format!("Failed to read file '{}': {}", path, e))
}

#[tauri::command]
fn write_document_file_atomic(path: String, data: Vec<u8>) -> Result<(), String> {
    let target_path = Path::new(&path);
    let temp_path = target_path.with_extension(format!("tmp_{}", std::process::id()));

    // Write to temporary file first for atomic safety
    fs::write(&temp_path, &data)
        .map_err(|e| format!("Failed to write temporary file: {}", e))?;

    // Atomic rename/move to target path
    fs::rename(&temp_path, target_path)
        .map_err(|e| {
            // Clean up temporary file on rename failure
            let _ = fs::remove_file(&temp_path);
            format!("Failed to save file atomically to '{}': {}", path, e)
        })?;

    Ok(())
}

#[tauri::command]
fn reveal_in_file_manager(path: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg("-R")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(format!("/select,\"{}\"", path))
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        if let Some(parent) = Path::new(&path).parent() {
            std::process::Command::new("xdg-open")
                .arg(parent)
                .spawn()
                .map_err(|e| e.to_string())?;
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            read_document_file,
            write_document_file_atomic,
            reveal_in_file_manager
        ])
        .run(tauri::generate_context!())
        .expect("error while running WordLite application");
}
