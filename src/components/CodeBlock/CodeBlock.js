"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./CodeBlock.module.css";

const KEYWORDS = new Set([
  "void",
  "if",
  "else",
  "while",
  "for",
  "return",
  "int",
  "float",
  "long",
  "char",
  "const",
  "true",
  "false",
  "null",
  "static",
  "class",
  "new",
  "delete",
  "include",
  "define",
]);

const TYPES = new Set([
  "String",
  "StaticJsonDocument",
  "DeserializationError",
  "WiFi",
]);

const FUNCS = new Set([
  "begin",
  "show",
  "ledcAttach",
  "ledcWrite",
  "pinMode",
  "delay",
  "constrain",
  "setMotores",
  "medirDistancia",
  "setPixelColor",
  "Color",
  "deserializeJson",
  "send",
  "handleClient",
  "on",
  "status",
]);

function highlight(line) {
  // Simple inline tokenizer using regex segments
  const tokens = [];
  // Comments
  const commentIdx = line.indexOf("//");
  if (commentIdx !== -1) {
    return [
      ...tokenize(line.slice(0, commentIdx)),
      <span key="cmt" className={styles.comment}>
        {line.slice(commentIdx)}
      </span>,
    ];
  }
  return tokenize(line);
}

function tokenize(text) {
  const out = [];
  const regex =
    /("[^"]*")|('[^']*')|(\b\d+(?:\.\d+)?[ufLl]?\b)|(\b[A-Za-z_][A-Za-z0-9_]*\b)|([{}()\[\];,.<>+\-*/%=!&|?:]+)|(\s+)/g;
  let m;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m[1] || m[2]) {
      out.push(
        <span key={i++} className={styles.string}>
          {m[0]}
        </span>
      );
    } else if (m[3]) {
      out.push(
        <span key={i++} className={styles.number}>
          {m[0]}
        </span>
      );
    } else if (m[4]) {
      const w = m[0];
      if (KEYWORDS.has(w)) {
        out.push(
          <span key={i++} className={styles.keyword}>
            {w}
          </span>
        );
      } else if (TYPES.has(w)) {
        out.push(
          <span key={i++} className={styles.type}>
            {w}
          </span>
        );
      } else if (w === w.toUpperCase() && w.length > 2) {
        out.push(
          <span key={i++} className={styles.constant}>
            {w}
          </span>
        );
      } else if (FUNCS.has(w)) {
        out.push(
          <span key={i++} className={styles.func}>
            {w}
          </span>
        );
      } else {
        out.push(
          <span key={i++} className={styles.ident}>
            {w}
          </span>
        );
      }
    } else if (m[5]) {
      out.push(
        <span key={i++} className={styles.punct}>
          {m[0]}
        </span>
      );
    } else {
      out.push(<span key={i++}>{m[0]}</span>);
    }
  }
  return out;
}

export default function CodeBlock({ code, title, language = "cpp" }) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={styles.wrap}
    >
      <header className={styles.header}>
        <div className={styles.dots}>
          <span />
          <span />
          <span />
        </div>
        <p className={styles.title}>{title || `firmware.${language}`}</p>
        <button
          type="button"
          className={styles.copy}
          onClick={copy}
          aria-label="Copiar código"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? "Copiado" : "Copiar"}</span>
        </button>
      </header>
      <pre className={`${styles.pre} mono`}>
        <code>
          {lines.map((line, idx) => (
            <span key={idx} className={styles.line}>
              <span className={styles.lineNo} aria-hidden="true">
                {String(idx + 1).padStart(2, " ")}
              </span>
              <span className={styles.lineText}>
                {line.length === 0 ? " " : highlight(line)}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </motion.div>
  );
}
