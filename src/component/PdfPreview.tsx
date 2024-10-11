import * as pdfjsLib from "pdfjs-dist";
import { memo, useEffect, useRef, useState } from "react";
import pdfFile from "../assets/炭黑尾气用于精煤干燥新技术的探讨与应用_庞秀英.pdf";

const loadAllPages = async (pdfDoc: pdfjsLib.PDFDocumentProxy) => {
  const pages = [];

  // 获取文档中的总页数
  const numPages = pdfDoc.numPages;

  // 遍历文档中的每一页
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    pages.push(page);
  }
  return pages;
};

const Page = memo(
  ({
    page,
    boxSize,
  }: {
    page: pdfjsLib.PDFPageProxy;
    boxSize: { width: number; height: number };
  }) => {
    const pageRef = useRef<HTMLDivElement>(null);
    if (page) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (pageRef.current) {
        pageRef.current.innerHTML = "";
        pageRef.current.appendChild(canvas);
      }
      const viewport = page.getViewport({ scale: 1 });
      const scale = boxSize.width / viewport.width;
      if (canvas && context && viewport) {
        canvas.width = Math.floor(viewport.width) * scale;
        canvas.height = Math.floor(viewport.height) * scale;
        canvas.style.width = Math.floor(viewport.width) * scale + "px"; // 设置canvas的宽度
        canvas.style.height = Math.floor(viewport.height) * scale + "px"; // 设置canvas的高度
        page.render({
          canvasContext: context,
          viewport: page.getViewport({ scale }),
        });
      }
    }
    return <div id="page" ref={pageRef}></div>;
  }
);
const PdfPreview = () => {
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
    pdfjsLib.getDocument(pdfFile).promise.then(async (pdfDoc) => {
      const pages = await loadAllPages(pdfDoc);
      setPages(pages);
    });
  }, []);

  const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);
  // 获取容器
  const containerRef = useRef<HTMLDivElement>(null);

  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
  // 监听页面尺寸变化，重新渲染pdf
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === "pdfContainer") {
          setBoxSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      });
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
  }, []);
  return (
    <div id="pdfContainer" ref={containerRef}>
      {pages.length
        ? pages.map((page, index) => {
            return <Page key={index} page={page} boxSize={boxSize} />;
          })
        : "正在加载"}
    </div>
  );
};

export default PdfPreview;
