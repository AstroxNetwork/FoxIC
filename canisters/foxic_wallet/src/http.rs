use ic_cdk::api::*;
use ic_cdk_macros::*;

use crate::types::{HeaderField, HttpRequest, HttpResponse};
use lazy_static::lazy_static;

use serde::Deserialize;

lazy_static! {
    static ref DEFAULT_JSON_HEADER: std::sync::Mutex<Vec<HeaderField>> =
        std::sync::Mutex::new(vec![HeaderField(
            String::from("content-type"),
            String::from("application/json"),
        )]);
    static ref DEFAULT_TEXT_HEADER: std::sync::Mutex<Vec<HeaderField>> =
        std::sync::Mutex::new(vec![HeaderField(
            String::from("content-type"),
            String::from("text/plain"),
        )]);
    static ref DEFAULT_HTML_HEADER: std::sync::Mutex<Vec<HeaderField>> =
        std::sync::Mutex::new(vec![HeaderField(
            String::from("content-type"),
            String::from("text/html"),
        )]);
}

// A common handlers

pub fn ok200() -> HttpResponse {
    HttpResponse {
        status_code: 200,
        headers: DEFAULT_HTML_HEADER.lock().unwrap().to_vec(),
        body: "Nothing to do".as_bytes().to_vec(),
        upgrade: Some(false),
    }
}

pub fn res_200(body: Vec<u8>) -> HttpResponse {
    HttpResponse {
        status_code: 200,
        headers: DEFAULT_JSON_HEADER.lock().unwrap().to_vec(),
        body,
        upgrade: Some(false),
    }
}

pub fn index(_req: HttpRequest) -> HttpResponse {
    HttpResponse {
        status_code: 200,
        headers: DEFAULT_TEXT_HEADER.lock().unwrap().to_vec(),
        body: "get_info()".as_bytes().to_vec(),
        upgrade: Some(false),
    }
}
pub fn err404(req: HttpRequest) -> HttpResponse {
    HttpResponse {
        status_code: 404,
        headers: vec![],
        body: format!(
            "Nothing found at {}\n(but still, you reached the internet computer!)",
            req.url
        )
        .as_bytes()
        .to_vec(),
        upgrade: Some(false),
    }
}
