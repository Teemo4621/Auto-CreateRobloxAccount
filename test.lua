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

function GetCar()
    for i,v in ipairs(game:GetService("Players").LocalPlayer.PlayerGui.MainHUD.Vehicles.Container.List:GetChildren()) do
        if v.ClassName == "ImageButton" and v:FindFirstChild("VehicleName") and v.Name ~= "Template" then
            return v.Name
        end
    end
end

--Auto Farm
StartPosition = CFrame.new(Vector3.new(-34453.4648, 34.3936348, -32754.6387, -0.887718797, -0.00943092164, -0.460289478, -0.0085602235, 0.999955416, -0.00397886429, 0.460306495, 0.000408068387, -0.887759984), Vector3.new())
EndPosition = CFrame.new(Vector3.new(-33167.5547, 34.3963928, -30203.9102, -0.895898819, -0.0100118732, -0.444145352, -0.00895143207, 0.999949872, -0.00448455475, 0.444168001, -4.19701537e-05, -0.895943522), Vector3.new())
AutoFarmFunc = coroutine.create(function()
    local args = {
        [1] = "playInitiated",
        [2] = {
            ["buttonsClicked"] = {
                [1] = "Shop",
                [2] = "Play"
            },
            ["fps"] = 31
        }
    }
    
    game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("InformGeneralEventFunnel"):FireServer(unpack(args))    
    
    local args = {
        [1] = "Spawn",
        [2] = GetCar()
    }
    
    game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("VehicleEvent"):FireServer(unpack(args))

    while wait() do
        if not AutoFarm then
            AutoFarmRunning = false
            coroutine.yield()
        end
        AutoFarmRunning = true
        pcall(function()
            for i = 1, 7 do
                local args = {
                    [1] = i
                }
                
                game:GetService("ReplicatedStorage"):WaitForChild("Remotes"):WaitForChild("PlayRewards"):FireServer(unpack(args))   
            end

            if not GetCurrentVehicle() and tick() - (LastNotif or 0) > 5 then
                LastNotif = tick()
            else
                game:GetService("VirtualInputManager"):SendKeyEvent(true,Enum.KeyCode.E,false,game)
                TP(StartPosition + (TouchTheRoad and Vector3.new(0, 0, 0) or Vector3.new(0, 0, 0)))
                VelocityTP(EndPosition + (TouchTheRoad and Vector3.new(0, 0, 0) or Vector3.new(0, 0, 0)))
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
local win = lib:Window("ZEMON HUB", "MAKE BY: ZEMONNUB 💖", Color3.fromRGB(102, 0, 255), _G.closeBind)                -- done mess with

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
