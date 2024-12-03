'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface IFormInputs {
  username: string
  password: string
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [scores, setScores] = useState<{ username: string; score: number }[]>(
    []
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Validação do formulario
  const schema = z.object({
    username: z
      .string()
      .nonempty('O nome de usuário é obrigatório')
      .refine((value) => !/\s/.test(value), {
        message: 'O nome de usuário não pode conter espaços.'
      }),
    password: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres')
      .nonempty('A senha é obrigatória')
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<IFormInputs>({
    resolver: zodResolver(schema)
  })

  // Função para buscar os pontos da API
  const fetchScores = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/scores`
      )
      setScores(response.data) // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error('Erro ao buscar as pontuações:', error)
    }
  }

  // Carregar os pontos quando o componente for montado
  useEffect(() => {
    fetchScores()
  }, [])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    setSuccessMessage(null)
    setErrorMessage(null) // Limpar mensagem de erro ao tentar novo cadastro

    // Remover espaços do username antes de enviar
    const username = data.username.trim()

    // Atualiza o valor do username sem espaços no form
    setValue('username', username)

    try {
      // Envia os dados para cadastro
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        { ...data, username } // Envia o username sem espaços
      )

      // Se o cadastro for bem-sucedido
      console.log('Cadastro bem-sucedido:', response.data)
      setSuccessMessage('Cadastro realizado com sucesso!')
      setIsSuccessModalOpen(true)
      reset() // Limpar os campos do formulário após o cadastro
    } catch (error: any) {
      // Verifica se o erro está relacionado ao nome de usuário já existente
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.includes(username)) {
          setErrorMessage(`O usuário ${username} já está em uso. Tente outro.`)
        } else {
          setErrorMessage('Ocorreu um erro ao cadastrar. Tente novamente.')
        }
      } else {
        setErrorMessage('Ocorreu um erro ao cadastrar. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
    setSuccessMessage(null) // Limpar mensagem de sucesso quando o modal for fechado
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#2E3A59]">
      <header className="mb-8 flex w-full items-center justify-between rounded-t-md border-b-4 border-[#FFC107] bg-[#2C1F3C] px-8 py-4 shadow-md">
        <div className="mx-auto flex w-full max-w-7xl justify-between">
          <div className="text-2xl font-bold tracking-wide text-[#FFC107]">
            Kings & Scores
          </div>
          <div className="flex space-x-4">
            <button className="rounded-md border-2 border-[#FFC107] px-5 py-2 font-semibold text-white shadow transition duration-200 hover:bg-[#FFC107] hover:text-[#2E3A59] hover:ring-2 hover:ring-[#FFC107]">
              <Link download href="/files/KingAdventure.zip">
                Download
              </Link>
            </button>

            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button className="rounded-md bg-[#FFC107] px-5 py-2 font-semibold text-[#2E3A59] shadow transition duration-200 hover:bg-[#FFB300]">
                  Cadastro
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-[#2C1F3C] p-6 shadow-lg">
                  <Dialog.Title className="mb-4 text-lg font-bold text-[#FFC107]">
                    Cadastro
                  </Dialog.Title>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                      <label className="mb-2 block text-[#FFC107]">
                        Username
                      </label>
                      <input
                        type="text"
                        {...register('username')}
                        className="w-full rounded-md bg-[#3A3B58] p-2 text-[#F0E5D8]"
                      />
                      <p className="mt-1 text-sm text-[#FF4D4D]">
                        {errors.username?.message}
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2 block text-[#FFC107]">Senha</label>
                      <input
                        type="password"
                        {...register('password')}
                        className="w-full rounded-md bg-[#3A3B58] p-2 text-[#F0E5D8]"
                      />
                      <p className="mt-1 text-sm text-[#FF4D4D]">
                        {errors.password?.message}
                      </p>
                    </div>

                    {/* Exibe a mensagem de erro, caso o username já exista */}
                    {errorMessage && (
                      <p className="mt-4 text-center text-lg font-semibold text-[#FF4D4D]">
                        {errorMessage}
                      </p>
                    )}

                    {/* Exibe a mensagem de sucesso */}
                    {successMessage && (
                      <p className="mt-4 text-center text-lg font-semibold text-[#34A124]">
                        {successMessage}
                      </p>
                    )}

                    <div className="mt-4 flex justify-end">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="mr-2 rounded-md bg-[#D92F2F] px-4 py-2 font-semibold text-white hover:bg-[#B72B2B]"
                          disabled={isSubmitting}>
                          Cancelar
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        className="rounded-md bg-[#3DBE29] px-4 py-2 font-semibold text-white hover:bg-[#34A124]"
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Registrando...' : 'Registrar'}
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>

      <Dialog.Root
        open={isSuccessModalOpen}
        onOpenChange={handleCloseSuccessModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-[#2C1F3C] p-6 shadow-lg">
            <Dialog.Title className="mb-4 text-lg font-bold text-[#FFC107]">
              Sucesso!
            </Dialog.Title>
            <p className="text-center text-lg font-semibold text-[#34A124]">
              {successMessage}
            </p>
            <div className="mt-4 flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-md bg-[#3DBE29] px-4 py-2 font-semibold text-white hover:bg-[#34A124]">
                  Fechar
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <main className="w-full max-w-3xl rounded-b-md bg-[#3A3B58] p-6 shadow-lg">
        <h1 className="mb-4 text-center text-3xl font-bold text-[#FFC107]">
          Top 10 Scores
        </h1>
        <div className="overflow-hidden rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-[#2C1F3C] text-[#FFC107]">
              <tr>
                <th className="p-4 font-medium">Jogador</th>
                <th className="p-4 font-medium">Pontuação</th>
              </tr>
            </thead>
            <tbody>
              {scores === null ? (
                <tr>
                  <td className="border-b border-[#2E3A59] p-4 text-xl text-[#F0E5D8]">
                    Nenhum score encontrado
                  </td>
                </tr>
              ) : (
                scores.map((score, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#2E3A59] p-4 text-xl text-[#F0E5D8]">
                      {score.username}
                    </td>
                    <td className="border-b border-[#2E3A59] p-4 text-xl text-[#F0E5D8]">
                      {score.score}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
