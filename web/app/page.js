// Temporary home page for the scaffold. The real landing page (DesignSystem.md
// section 4: what the app does, 4 steps, privacy, register / login) replaces it
// in the next task.
export default function Home() {
  return (
    <section className="bg-brand-gradient flex flex-1 items-center">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-16 md:px-6">
        <div className="glass max-w-xl rounded-xl p-8">
          <h1 className="text-display font-bold text-text">
            เข้าใจตัวเองก่อน แล้วงานที่ใช่จะชัดขึ้น
          </h1>
          <p className="mt-4 text-body text-text-muted">
            อัปโหลด CV หรือตอบแบบสอบถาม แล้วดูว่าทักษะของคุณเหมาะกับสายงาน IT แบบไหน
          </p>
          <p className="mt-6 text-small text-text-muted">หน้าแรกฉบับเต็มกำลังพัฒนา</p>
        </div>
      </div>
    </section>
  );
}
