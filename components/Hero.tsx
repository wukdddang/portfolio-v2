"use client";

import { motion } from "framer-motion";
import { ArrowDown, FileText, Briefcase } from "lucide-react";
import { personal } from "@/data/personal";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Subtle background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-mono text-[var(--muted)] mb-8"
        >
          <span className="size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          AI 활용 5단계 · {personal.currentStage.range}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] break-keep"
        >
          {personal.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed"
        >
          {personal.subTagline}. <br className="hidden md:block" />
          {personal.identity}.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Briefcase className="size-4" />
            프로젝트 보러가기
            <ArrowDown className="size-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#resume"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-[var(--subtle)] transition-colors"
          >
            <FileText className="size-4" />
            이력서 PDF
            <span className="text-xs text-[var(--muted)] font-mono ml-1">(준비 중)</span>
          </a>
        </motion.div>

        {/* meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-xs font-mono text-[var(--muted)] border-t border-[var(--border)] pt-6"
        >
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              메인 직군
            </div>
            <div className="text-[var(--foreground)]">웹 개발 · 풀스택</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              학습 도메인
            </div>
            <div className="text-[var(--foreground)]">SAR · 위성영상</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              AI 활용 단계
            </div>
            <div className="text-[var(--foreground)]">{personal.currentStage.range}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1">
              연차
            </div>
            <div className="text-[var(--foreground)]">{personal.yearsExperience}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
