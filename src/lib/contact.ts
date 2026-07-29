/** Dados de contato do administrador master (edite aqui). */
export const CONTACT = {
  /** Número no formato internacional, apenas dígitos. Ex.: 5511999998888 */
  whatsapp: "5511999998888",
  email: "contato@zaply.app",
  instagram: "https://instagram.com/zaply",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body: string) {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
