--Vars
LocalPlayer = game:GetService("Players").LocalPlayer
Camera = workspace.CurrentCamera
VirtualUser = game:GetService("VirtualUser")
MarketplaceService = game:GetService("MarketplaceService")
--Get Current Vehicle
function GetCurrentVehicle()
    return LocalPlayer.Character and LocalPlayer.Character:FindFirstChild("Humanoid") and
    LocalPlayer.Character.Humanoid.SeatPart and LocalPlayer.Character.Humanoid.SeatPart.Parent
end

--Regular TP
function TP(cframe)
    GetCurrentVehicle():SetPrimaryPartCFrame(cframe)
end

--Velocity TP
function VelocityTP(cframe)
    TeleportSpeed = math.random(600, 600)
    Car = GetCurrentVehicle()
    local BodyGyro = Instance.new("BodyGyro", Car.PrimaryPart)
    BodyGyro.P = 5000
    BodyGyro.maxTorque = Vector3.new(9e9, 9e9, 9e9)
    BodyGyro.CFrame = Car.PrimaryPart.CFrame
    local BodyVelocity = Instance.new("BodyVelocity", Car.PrimaryPart)
    BodyVelocity.MaxForce = Vector3.new(9e9, 9e9, 9e9)
    BodyVelocity.Velocity = CFrame.new(Car.PrimaryPart.Position, cframe.p).LookVector * TeleportSpeed
    wait((Car.PrimaryPart.Position - cframe.p).Magnitude / TeleportSpeed)
    BodyVelocity.Velocity = Vector3.new()
    wait(0.1)
    BodyVelocity:Destroy()
    BodyGyro:Destroy()
end

--Auto Farm
StartPosition = CFrame.new(Vector3.new(7961.36328, 66.609726, -4573.53662, 0.806749642, 0.000695789058, -0.590892971, 0.000556417275, 0.999997973, 0.00193719869, 0.59089309, -0.00189161743, 0.806747615), Vector3.new())
AutoFarmFunc = coroutine.create(function()
    local args = {
        [1] = "Spawn",
        [2] = "Zenvo-TS1GT"
    }

    game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("VehicleEvent"):FireServer(unpack(args))

    while wait() do
        if not AutoFarm then
            AutoFarmRunning = false
            coroutine.yield()
        end
        AutoFarmRunning = true
        pcall(function()
            if not GetCurrentVehicle() and tick() - (LastNotif or 0) > 5 then
                LastNotif = tick()
            else
                game:GetService("VirtualInputManager"):SendKeyEvent(true,Enum.KeyCode.W,false,game) 
                TP(StartPosition + (TouchTheRoad and Vector3.new(0, 0, 0) or Vector3.new(0, 0, 0)))
            end
        end)
    end
end)

--Anti AFK
AntiAFK = true
LocalPlayer.Idled:Connect(function()
    VirtualUser:CaptureController()
    VirtualUser:ClickButton2(Vector2.new(), Camera.CFrame)
end)

local lib = loadstring(game:HttpGet("https://raw.githubusercontent.com/Simak90/pfsetcetc/main/fluxed.lua"))() -- UI Library
local win = lib:Window("ZEMON HUB", "MAKE WITH LOVE BY: ZEMONNUB 💖", Color3.fromRGB(102, 0, 255), _G.closeBind)                -- done mess with

---------Spins--------------------------------
local Visual = win:Tab("Main", "http://www.roblox.com/asset/?id=6023426915")
Visual:Label("Farms")
Visual:Line()

Visual:Toggle("Auto Farm", "Activates farm. Get in car to start", true, function(value)
    AutoFarm = value
    if value and not AutoFarmRunning then
        coroutine.resume(AutoFarmFunc)
    end
end)
Visual:Toggle("TouchTheRoad", "doesnt work for some cars", true, function(value)
    TouchTheRoad = value
end)
Visual:Toggle("AntiAFK", "simulates keypressing", true, function(value)
    AntiAFK = value
end)
